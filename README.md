<h1 align=center>Avarice</h1>
<p align=center>App for tracking personal finances</p>
<p align=center>
  💾 <a href="https://github.com/MatijaNovosel/avarice-backend">Backend</a>
</p>
<p align=center>
  📱 <a href="https://github.com/MatijaNovosel/avarice-mobile">Mobile</a>
</p>

![Dashboard](https://user-images.githubusercontent.com/36193643/194028498-1e2f76c5-0412-4d74-9e22-40f325642963.png)

![New transaction](https://user-images.githubusercontent.com/36193643/194028508-b6ba3262-4053-4679-b0da-1df17fd90fd0.png)

![New category](https://user-images.githubusercontent.com/36193643/194028528-c596fe54-813f-49cf-bd25-a20a23cdba95.png)

![Transactions](https://user-images.githubusercontent.com/36193643/194028534-ce519b90-ea18-4447-a5f3-6d31c623a088.png)

![Categories](https://user-images.githubusercontent.com/36193643/194028540-2176e3f1-fdc8-4d1f-b181-762385918c43.png)

## 🔨 Built With

- [Vue 3](https://vuejs.org/)
- [Quasar](https://quasar.dev/)

## 🚀 Features

- Finance tracking in any currency
- Customizable expense entries with additional data such as geographical location
- Transaction entry templating
- Visual representation of user data

## 🌟 Set up the frontend

### Install the dependencies

```bash
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
quasar dev
```

### Lint the files

```bash
npm run lint
```

### Build the app for production

```bash
quasar build
```

### Customize the configuration

See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).

## 🔧 Set up the backend

First off, clone the backend repository [here](https://github.com/MatijaNovosel/avarice-backend).

### Install the dot net core dependencies

```bash
dotnet restore
```

### Restore the MySQL database

```bash
dotnet ef database update
```

### Set the local MySQL connection string

```bash
dotnet user-secrets set "connectionString" "Server={server};Database={db};Uid={uid};Pwd={pwd};"
```

### Set the 16 character JWT signing key

```bash
dotnet user-secrets set "secretKey" "{key}"
```

### Run the backend

```bash
dotnet run
```
