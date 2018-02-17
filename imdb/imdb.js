const request = require("request");
const cheerio = require("cheerio");

function ltrim(str) {
  if(str == null) return str;
  return str.replace(/^\s+/g, '');
}

function imdbGetData(id) {
  // request(`http://www.imdb.com/title/${id}`, (err, res, body) => {
  //   if (err)
  //     return
  //   var title;
  //
  //   var $ = cheerio.load(body);
  //
  //   title = $(".title_wrapper").text().split(" ")[0]
  // });

    request("https://www.imdb.com/title/tt2193021/episodes?season=1", (err, res, body) => {
      if (err)
        return

      var arr = [];
      var airdates = [];
      var show = {
        Seasons: []
      };

      var j = cheerio.load(body);
      var seasonNum = j("#bySeason").children().last().attr("value") + 1;
      for (var i=1; i < seasonNum; i++){
        request('https://www.imdb.com/title/tt2193021/episodes?season=' + i, (err, res, body) => {
          if (err) return
          var $ = cheerio.load(body);

          $("div .info .airdate").each(function(index, item) {
            var airdate = String($(this).text());
            airdates.push(airdate.trim());
          });

          $("div .image a").each(function(index, item) {
              var airdate = airdates[index];
              var episode_name = $(this).attr("title");

              if (episode_name && !String(episode_name).includes("#")){
                arr.push({episode_name, airdate});
              }
          });
          setTimeout(() => {
            show.Seasons.push(arr);
            console.log(show.Seasons);
          }, 5000)

        });

      }
      console.log(show.Seasons);
  });
}

// season = {
//   seasons: [[ {epsiode_name} ], [{Epsiode name}]]
// }

imdbGetData("tt2193021");
