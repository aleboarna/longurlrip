import { app } from './server';
app.listen(process.env.PORT || 5000, () => {
  console.log(`running ${process.env.PORT || 5000}`);
  console.log(
    `Registered routes: [${app._router.stack
      .filter((r) => r.route) // only include routes, not middleware
      .map((r) => `"${r.route.path}"`)}]` // get route paths
  );
});
