---
layout: post
permalink: /blog/2025-08-29-modular-monolith-1
date: 2025-08-29 00:46:00 -0700
title: Blurring the lines of modular monoliths and microservices in .NET with preprocessor directives
---

This is an exploration of the idea of having both a modular monolith and microservice architecture; the possibility of splitting the deployments up for the purpose of scaling with little compromise. Using directives, build configurations, and some smart architectural patterns, you can setup your deployables to one, or more depending on your needs. This is simply a "how to", and I'm not engaging into the "why" on modular monoliths or microservices. With this configuration, you don't need to engage one way or the other because you can have both! Sometimes, it pays to be indecivive.

If you plan on sticking to a modular monolith and never ever want to scale out, this may not be for you. But what if you need the benefits of microservices? You wouldn't want to deploy your entire 100 service application just to scale one service.

Before you get too eager to adopt this pattern, I must warn: it is another vector for potential bugs. That's why I'm planning on writing what you see here into a library with source generation and possibly a dotnet tool, as I see the potential, but we're not quite there *yet*.

## Setting it all up

Our project setup is pretty standard modular monolith stuff:

```
src/
├─ host/
│  ├─ Domain.Host.Web/
│  │  ├─ Program.cs
│  │  ├─ Domain.Host.Web.csproj
├─ product/
│  ├─ Domain.Product/
│  │  ├─ SomeCode.cs
│  │  ├─ Domain.Host.csproj
├─ customer/
│  ├─ Domain.Customer/
│  │  ├─ SomeMoreCode.cs
│  │  ├─ Domain.Customer.csproj
├─ Domain.sln
├─ Domain.slnx 
```

We have 3 projects: 1 Project is Domain.Host, which is our entrypoint. For each build configuration, we're including different project references. *Debug* and *Release* builds the monolith, so all projects are included, while the four other configurations only reference their respective projects.

```xml
<Project Sdk="Microsoft.NET.Sdk.Web">
  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
  </PropertyGroup>
  <ItemGroup Condition="'$(Configuration)' == 'Debug' Or '$(Configuration)' == 'Release'">
    <ProjectReference Include="..\..\customer\Domain.Customer\Domain.Customer.csproj" />
    <ProjectReference Include="..\..\product\Domain.Product\Domain.Product.csproj" />
  </ItemGroup>
  <ItemGroup Condition="'$(Configuration)' == 'Debug Customer' Or '$(Configuration)' == 'Release Customer'">
    <ProjectReference Include="..\..\customer\Domain.Customer\Domain.Customer.csproj" />
  </ItemGroup>
  <ItemGroup Condition="'$(Configuration)' == 'Debug Product' Or '$(Configuration)' == 'Release Product'">
    <ProjectReference Include="..\..\product\Domain.Product\Domain.Product.csproj" />
  </ItemGroup>
</Project>
```

You'll need to specify the configurations in the sln/slnx file. The sln file is quite ugly so I'm not going to bother sharing what that looks like. Instead, I'll show what my slnx file looks like. You'll notice each project shows which configurations are being built. All projects are built when building for Debug or Release, while Domain.Customer.csproj doesn't include the BuildType *Debug Product*/*Release Product*, and Domain.Product.csproj doesn't include the BuildType for *Debug Customer*/*Release Customer*.

```xml
<Solution>
 <Configurations>
    <BuildType Name="Debug" />
    <BuildType Name="Debug Customer" />
    <BuildType Name="Debug Product" />
    <BuildType Name="Release" />
    <BuildType Name="Release Customer" />
    <BuildType Name="Release Product" />
    <Platform Name="Any CPU" />
    <Platform Name="x64" />
    <Platform Name="x86" />
  </Configurations>
  <Folder Name="src">
    <Folder Name="host">
    <Project Path="src/host/Domain.Host/Domain.Host.csproj">
      <BuildType Solution="Debug|*" Project="Debug" />
      <BuildType Solution="Debug Customer|*" Project="Debug" />
      <BuildType Solution="Debug Product|*" Project="Debug" />
      <BuildType Solution="Release|*" Project="Release" />
      <BuildType Solution="Release Customer|*" Project="Release" />
      <BuildType Solution="Release Product|*" Project="Release" />
    </Project>
    <Project Path="src/customer/Domain.Customer/Domain.Customer.csproj">
      <BuildType Solution="Debug|*" Project="Debug" />
      <BuildType Solution="Debug Customer|*" Project="Debug" />
      <BuildType Solution="Release|*" Project="Release" />
      <BuildType Solution="Release Customer|*" Project="Release" />
    </Project>
    <Project Path="src/product/Domain.Product/Domain.Product.csproj">
      <BuildType Solution="Debug|*" Project="Debug" />
      <BuildType Solution="Debug Product|*" Project="Debug" />
      <BuildType Solution="Release|*" Project="Release" />
      <BuildType Solution="Release Product|*" Project="Release" />
    </Project>
  </Folder>
</Solution>
```

The magic happens inside of Program.cs. There will be five sections in our file.

1. Defining the services
2. Defining features
3. The using statements
4. The app initialization
5. App configuration

The first two sections simply use preprocessor directives to define the services and needed features of the services. *DEBUG_CUSTOMER* should be defined if the configuration is *Debug Customer*. We'll use preprocessor directives later to define features and initialize our services. We'll pretend that our services have slightly different needs, like the Customer service might use MassTransit while the Product service doesn't, but it needs views. It's okay, for example, that *ENTITY_FRAMEWORK_CORE* is defined twice. This is to ensure our features are only initialized once to prevent bugs. It's important to keep track of which apps use which features.

```c#
#region Define services
#if DEBUG_CUSTOMER || RELEASE_CUSTOMER || DEBUG || RELEASE
#define CUSTOMER_SERVICE
#endif

#if DEBUG_PRODUCT || RELEASE_PRODUCT || DEBUG || RELEASE
#define PRODUCT_SERVICE
#endif
#endregion

#region Defining features
#if CUSTOMER_SERVICE
#define ENTITY_FRAMEWORK_CORE
#define MASSTRANSIT
#define ROUTING
#define AUTHORIZATION
#define CONTROLLERS
#endif

#if PRODUCT_SERVICE
#define ENTITY_FRAMEWORK_CORE
#define ROUTING
#define AUTHORIZATION
#define CONTROLLERS_WITH_VIEWS
#endif
#endregion
```

In the third section, you can start to see why we needed to define services and features separately. We're surrounding our using statements with these preprocessor directives. If these were lumped together in with the services, we would have gotten the warning CS0105 about duplicate using statements.

```c#
#region Using statements
#if CUSTOMER_SERVICE
using Domain.Custmer;
#endif
#if PRODUCT_SERVICE
using Domain.Product;
#endif
#if MASSTRANSIT
using MassTransit;
#endif
#if ENTITY_FRAMEWORK_CORE
using Microsoft.EntityFrameworkCore;
#endif
#endregion
```

Now, it's time for the app initialization. I do recommend generally separating each line into its own feature. However, and this is important. You'll have to keep track of which apps use which feature, or you'll run into problems when you find apps are using features that are not defined.

```c#
#region App initialization

var builder = WebApplication.CreateBuilder(args);

#if ENTITY_FRAMEWORK_CORE
    builder.Services.AddDbContextFactory<DbContext>(
        options => options.UseSqlServer(builder.Configuration.GetConnectionString("Domain")!));
#endif

// It can get a bit tricky with cases like this where it's not simply "On" or "Off"
#if CONTROLLERS_WITH_VIEWS
var mvcBuilder = builder.Services.AddControllersWithViews();
#elif CONTROLLERS
var mvcBuilder = builder.Services.AddControllers();
#endif

#if CUSTOMER_SERVICE
// Defined in Domain.Customer
builder.Services.AddCustomerService();
#endif

#if PRODUCT_SERVICE
// Defined in Domain.Product
builder.Services.AddProductService();
#endif

#if MASSTRANSIT
builder.Services.AddMassTransit(config =>

#if CUSTOMER_SERVICE
  // Defined in Domain.Customer
  config.AddCustomerServiceConsumers();
#endif
    // 
    config.UsingInMemory((context, cfg) =>
    {
        cfg.ConfigureEndpoints(context);
    });
});
#endif
#endregion

#region App configuration
var app = builder.Build();

#if ROUTING
app.UseRouting();
#endif 

#if AUTHORIZATION
app.UseAuthorization();
#endif

#if CONTROLLERS
// Might not be the best pattern structure for a modular monolith
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");
#endif

#endregion
```

That's about it! Keep your application host program light and you probably won't be editing it too much except to add new services.

## Considerations of this approach

### You really need to keep track of which services use which features

If you add a feature down the line to a service and it's defined in another service, it might build fine in modular monolith mode, but fail to build when scaling out a service because the necessary feature wasn't defined in the app's feature preprocessor directive. Or worse: it might build, but fail in unexpected ways later.

### More deployables can lead to more solution configurations

If you plan on using this as an option to deploy many microservices, and you have many projects, you'll likely have twice as many configurations as services. I'm hopeful with the rise of slnx, this won't be much of a problem.

### Designed with one entry point in mind

If you hope to use something like Azure functions, AWS lambdas, or anything else that controls the entry points, it seems pretty obvious but this is not relevant to that. You'll still need to create separate a project for each entrypoint in this case. It's still possible to have a lambda and a modular monolith in the same solution.

### Horizontal scaling is more attuned for the message broker pattern

We use MassTransit which works well for our needs, although I've heard good things about other message brokers. Our setup allows us to deploy more or less applications with relative ease. If you're planning on horizontally scaling your API services, you'll probably want some load balancers and/or API gateways to distribute the load and route you to the correct app. I have considered that one option would be to put as much of your business logic as you can into a message broker, and give your APIs and webpages one single entrypoint with minimal business logic inside.

### Horizontal scaling requires more complicated setups with load balancers and/or API gateways

This is less a limitation of this pattern and more the reality of the microservices pattern. You'll need to configure your API routes for the possibility of other service existing on apps with other applications. You might need more special configurations for your API gateways and load balancers with things like Blazor. We've actually moved away from Blazor internally because of its architecture and client/server requirements, such as its sticky session requirement.

### Probably wait a bit before following this pattern

I've been using this pattern for about 9 months and I'm working out the kinks. I think as it stands, this pattern is a little awkward to use and it is easy to introduce bugs that might not be visible if you're using one deployable until you start scaling out into multiple deployables. However, the main reason I think you should wait before implementing this pattern is because I think this pattern has potential as a library using source generation for setting up the and probably a .NET tool for creating different build configurations.