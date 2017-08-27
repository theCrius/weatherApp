## What I need to make this works?

Right, so you need a couple of things installed:

- npm & node
- ionic & cordova

After that you need to run:

```
cp service/.env.sample service/.env
```

### How do I turn this on?

So I'm not that expert with Ionic or Angular2 (in fact this is my first try with it) so bear with me as this is going to be kind of crude:

To start the service:
```
cd service && node index.js
```

To start the frontend:
```
cd front_web && ionic serve
```
