"use strict";

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

Route.get("/", () => {
  return "OK";
});

Route.group(() => {
  Route.get("/movies/today", "ScheduleController.moviesToday");
  Route.get("/cinemas", "ScheduleController.cinemas");
  Route.get("/schedules", "ScheduleController.schedules");
  Route.get("/movies/soon", "ScheduleController.moviesSoon");
}).prefix("/api");
