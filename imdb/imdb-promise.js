const axios = require("axios");
const cheerio = require("cheerio");

async function imdbGetData(id) {
    var title, show, $;
    var arr = await [];
    var airdates = await [];
    show = {
    seasons: []
    };

    let body = await axios.get(`http://www.imdb.com/title/${id}/`);

    $ = cheerio.load(body.data);
    title = $("div h1").text()
    show.show_name = title;
    for(var x=1; x < 8; x++) {
        url = `http://www.imdb.com/title/${id}/episodes?season=${x}`
        let body = await axios.get(url);
        $ = cheerio.load(body.data);
        // console.log(x);// 6, 6, 6, 6
        $("div .info .airdate").each(function(index, item) {
            var airdate = String($(this).text());
            airdates.push(airdate.trim());
        });

        $(".info strong a").each(function(i, item){
            var epsiode_name = $(this).text()
            if (epsiode_name && !epsiode_name.includes("#")){
              var airdate = airdates[i];
              console.log(airdate)

              console.log(epsiode_name)
              arr.push({epsiode_name, airdate});
            }
        });
        show.seasons.push(arr);
        arr = [];
        airdates = [];
    }
    return new Promise((resolve, reject) => {
      resolve(show)
    });
}

// imdbGetData("tt2193021").then((show) => {
//   console.log(show)
// })

module.exports = {imdbGetData};
