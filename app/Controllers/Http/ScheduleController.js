"use strict";

const Env = use('Env')
const Host = "http://" + Env.get("HOST") + ":" + Env.get("PORT")
const rp = require("request-promise");
const moment = require("moment")
moment.locale("id");

class ScheduleController {
  async moviesToday({ request, response }) {
    const { city } = request.get();
    const api = JSON.parse(
      await rp("https://api.gojekapi.com/v4/web/movie/now_playing?city=" + city)
    );

    const result = [];
    api.data.forEach(data => {
      result.push({
        id: data.event_id,
        name: data.name,
        poster: data.image,
        genre: data.genre,
        duration: data.duration,
        rating: data.rating
      });
    });

    response.json(result);
  }

  async moviesSoon({ request, response }) {
    const { month, year, page } = request.get();
    const api = JSON.parse(
      await rp("https://www.comingsoon.net/wp-admin/admin-ajax.php?action=movies_wp&resource=movies/getbyyear&page=" + page + "&per_page=15&only_unreleased=1&month=" + month + "&criteria=monthly&year=" + year)
    );
    
    const result = [];
    api.forEach(data => {
      result.push({
        id: data.id,
        name: data.name,
        poster: data.poster_image || Host + "/NotFound.png",
        release: moment(data.release_date).format("DD MMMM YYYY"),
      });
    });

    response.json(result);
  }

  async cinemas({ request, response }) {
    const { movieId, city } = request.get();
    const api = JSON.parse(
      await rp("https://api.gojekapi.com/v4/web/movie/cinemas?event_id=" + movieId + "&city=" + city)
    );

    const result = [];
    api.data.cinemas.forEach(data => {
      result.push({
        id: data.location_id,
        name: data.name,
        cinema: Host + "/" + data.provider_name + ".png",
        address: data.address,
      });
    });

    response.json(result);
  }
  
  async schedules({ request, response }) {
    const { movieId, city, cinemaId } = request.get();
    const api = JSON.parse(
      await rp("https://api.gojekapi.com/v4/web/movie/cinemas?event_id=" + movieId + "&city=" + city)
    );

    const result = [];
    api.data.cinemas.forEach(data => {
      if (data.location_id == cinemaId) {
        data.schedules_list.forEach(schedules => {
          result.push({
            class: schedules.schedule_class,
            image: Host + "/Showtimes.png",
            showtimes: schedules.schedules.map(e => e.showtime).join(' | ')
          })
        });
      }
    });

    response.json(result);
  }
}

module.exports = ScheduleController;
