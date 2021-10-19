// https://observablehq.com/@d1d094ed1e90901c/a3-video-games-data@2145
import define1 from "./357f1a71f976f173@657.js";
import define2 from "./26670360aa6f343b@202.js";
import define3 from "./a2166040e5fb39a6@229.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["vgsales@2.csv",new URL("./files/f08c4f25813e4c0d7b278aea0b4b9f48e606cf63a58efc4bef465a6a42e73ffba330e2cec392b4a569fce8c4d7767a890182cd51fdd397d7810d182471529e11",import.meta.url)],["joinedTable@2.csv",new URL("./files/18b426ab7cf980f8e3fbb5c4da74d016b61216158d52a12f86f83903093cefc032ab394525dabf82155ce7bc35efcdb81c55dfad42aaf775ab0fc27aa41b1792",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`# A3: Video Games Data`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`By Andrea Wan and Fernanda Molina`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`<hr>
## Dataset: Video Games Data

Video games have been providing entertainment for both children and adults for decades. They've come a long way since the early days of computer games and consoles. Today they are more lifelike with pixelated displays and immersing audio. As there have been technological advancements, video games have advanced too. Therefore, we were interested in the following question: 
**how has the global sales of video game genres changed throughout the years based on the platform? ** 

This question seemed broad enough to provide us with comprehensive information on trends of global sales of video game genres as well as a decent summary of which platforms made which genre of sports by year.`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`
### About Dataset
This dataset contains statistics for a list of 16,598 video games with sales greater than 100,000 copies. The data includes sales rankings, game title (name), platform of the game's release, release year, genre, publisher, and sales (in millions) for America, Europe, Japan, and the rest of the world, respectively. The dataset contains data compiled by [GregorUT](https://github.com/GregorUT) on GitHub. 

The data is available from [Kaggle](https://www.kaggle.com/gregorut/videogamesales).
`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`<hr>
## Imports

Import DuckDB for data wrangling:
`
)});
  const child1 = runtime.module(define1);
  main.import("DuckDBClient", child1);
  main.variable(observer()).define(["md"], function(md){return(
md`Import the \`vega-lite-api\` library. Use Vega-Lite version 5 for data visualization:`
)});
  const child2 = runtime.module(define2);
  main.import("v1", child2);
  main.variable(observer()).define(["md"], function(md){return(
md`... and a \`printTable\` utility for formatting data tables:`
)});
  const child3 = runtime.module(define3);
  main.import("printTable", child3);
  main.variable(observer()).define(["md"], function(md){return(
md`Import Vega-Lite:`
)});
  main.variable(observer("VegaLite")).define("VegaLite", ["require"], function(require){return(
require("vega-embed@5")
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Import d3 as well:`
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@6")
)});
  main.variable(observer()).define(["md"], function(md){return(
md`(Later, uniqueValid will help us get a menu of unique values from a list.)`
)});
  const child4 = runtime.module(define3);
  main.import("uniqueValid", child4);
  main.variable(observer()).define(["md"], function(md){return(
md`<hr>
## Inserting Data`
)});
  main.variable(observer("vgsales")).define("vgsales", ["FileAttachment"], function(FileAttachment){return(
FileAttachment("vgsales@2.csv").csv({typed: true})
)});
  main.variable(observer()).define(["Inputs","vgsales"], function(Inputs,vgsales){return(
Inputs.table(vgsales)
)});
  main.variable(observer()).define(["md"], function(md){return(
md`<hr>
## Data Wrangling using DuckDB and SQL`
)});
  main.variable(observer()).define(["md"], function(md){return(
md` ### Inserting Data from CSV
Insert the data from the CSV file by creating a client directly from it.`
)});
  main.variable(observer("client1")).define("client1", ["DuckDBClient","FileAttachment"], async function(DuckDBClient,FileAttachment){return(
DuckDBClient.of([
  await FileAttachment('vgsales@2.csv')
  ])
)});
  main.variable(observer()).define(["md"], function(md){return(
md `Check the schema with \`describe()\`.`
)});
  main.variable(observer()).define(["client1"], function(client1){return(
client1.describe('vgsales@2')
)});
  main.variable(observer()).define(["client1"], function(client1){return(
client1.table(`SELECT Name FROM 'vgsales@2'`)
)});
  main.variable(observer()).define(["md"], function(md){return(
md`<hr>
## Interactive Visualisations`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`We can write a query that gives us the total sales by genre per year.`
)});
  main.variable(observer("totalGenrePerYear")).define("totalGenrePerYear", ["client1"], function(client1){return(
client1.query(`SELECT Year, Genre, sum(Global_Sales) as sales 
 FROM 'vgsales@2'
 GROUP BY Year, Genre
 ORDER BY Year`)
)});
  main.variable(observer()).define(["Inputs","totalGenrePerYear"], function(Inputs,totalGenrePerYear){return(
Inputs.table(totalGenrePerYear)
)});
  main.variable(observer()).define(["md"], function(md){return(
md`We want to inner join the totalGenrePerYear query with the vgsales dataset because in the future we will want to listen to signal changes in one visualization and update a signal in another visualization. This will require that both visualizations use the same data. 

The code below is the SQL query we ran using Postgres and Python since that was the easiest way to combine data and save it to a csv file.
`
)});
  main.variable(observer("joined")).define("joined", ["FileAttachment"], function(FileAttachment){return(
FileAttachment("joinedTable@2.csv").csv()
)});
  main.variable(observer()).define(["Inputs","joined"], function(Inputs,joined){return(
Inputs.table(joined)
)});
  main.variable(observer()).define(["md"], function(md){return(
md `Using the totalGenrePerYear query we decided to make a simple heatmap using Vega-Lite as a starting point for one of our visualizations.`
)});
  main.variable(observer("viewof heatmap")).define("viewof heatmap", ["vl","totalGenrePerYear"], function(vl,totalGenrePerYear){return(
vl.markRect()
  .data(totalGenrePerYear)
  .encode(
    vl.x().fieldN('Year'),
    vl.y().fieldN('Genre'),
    vl.color().fieldQ('sales')
    )
  .render()
)});
  main.variable(observer("heatmap")).define("heatmap", ["Generators", "viewof heatmap"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], function(md){return(
md`We can begin to add mouse interactions to the heatmap, which can show specific information about the data. 

One of the ways we can interact with the visualisation is through selection, which allows users to identify a specific data point as interesting. 

This example is adapted and modified from [Hailey Romney](https://observablehq.com/@promey/final-project-basketball-pay-to-win), and is also aids in understanding the usage of Vega-Lite in the JSON-compatible object format.`
)});
  main.variable(observer()).define(["VegaLite","totalGenrePerYear"], function(VegaLite,totalGenrePerYear){return(
VegaLite({
  data: {values: totalGenrePerYear},
  mark: {type: "rect", tooltip: true}, // The tooltip shows the data as a pop-up
  
  selection: {
    pts: {type: "single", on: "click"} // "mouseover" will allow for hovering
  },
  encoding: {
    y: {field: "Genre", type: "nominal", title: "Genre"}, // y axis
    x: {field: "Year", type: "nominal", title: "Year"}, // x axis

    color: {
      condition: {
        selection: "pts", // if cell is clicked, it is in "pts" and will be coloured
        field: "sales", type: "quantitative"
      },
      value: "gray" // everything else is gray
    }
  }
})
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Once we have selection implemented, it is possible for us to add other forms of interaction with the data visualisation, which will allow the user to gain a better understanding of the data. 

Based on the selection, users should then be able to drill down into the data to explore data hierarchies, and understand additional details about the data through selective filtering.

In order to do implement this, we will want to have some other visualisations which look more specifically at information related to the selected genre and year.`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`One of the things we may want to look at may be a closer look at what platforms produced certain genres during that particular year. For that, we will want a scatterplot where each data point represents a game in the selected genre, and perhaps we might also want to know what the sales were like for that particular game in relation to a platform. `
)});
  main.variable(observer()).define(["md"], function(md){return(
md` Here is an intial static sketch of what that visualisation might look like:`
)});
  main.variable(observer()).define(["vl","vgsales"], function(vl,vgsales){return(
vl.markPoint({filled: true})
  .data(vgsales)
  .encode(
    vl.x().fieldQ('Global_Sales')
      .scale({type: 'linear', domain: [0, 27]}),
    vl.y().fieldN('Platform'),
    vl.tooltip().fieldN('Name')
  )
  .width(950)
  .height(500)
  .render()
)});
  main.variable(observer()).define(["md"], function(md){return(
md`This sketch is a good starting point, but we can improve it by adding an interaction which will enable the users to filter the data. Features which enable the user to look at a specific subset of the data which interests them are good, because they allow for further exploration and a deeper understanding of the information presented.`
)});
  main.variable(observer()).define(["md"], function(md){return(
md` In order to do this, we will need to use the uniqueValid utility to get a list of unique genres.`
)});
  main.variable(observer("genres")).define("genres", function(){return(
["Action", "Adventure", "Fighting", "Misc", "Platform", "Puzzle", "Racing", "Role-Playing", "Shooter", "Simulation", "Sports", "Strategy"]
)});
  main.variable(observer()).define(["md"], function(md){return(
md`From there it will be possible to create a similar graphic which uses a drop-down menu to filter the data based on genre with the list we made above.`
)});
  main.variable(observer()).define(["vl","genres","vgsales"], function(vl,genres,vgsales)
{  
  const selectGenre = vl.selectPoint('Select')
    .fields('Genre')          // limit selection by one value for now
    .init({Genre: genres[0]}) // use first genre entry as initial value
    .bind(vl.menu(genres));         // bind to a menu of unique genre values
  
  // scatter plot, modify opacity based on genre selection
  return vl.markPoint({filled: true})
    .data(vgsales)
    .params(selectGenre)
    .encode(
      vl.x().fieldQ('Global_Sales')
        .scale({type: 'linear', domain: [0, 27]}),
      vl.y().fieldN('Platform'),
      vl.tooltip().fieldN('Name'), // hovering will show the name of the individual game
      vl.opacity().if(selectGenre, vl.value(1)).value(0.5) // opacity changes depending on the major genre
    )
    .width(950)
    .height(500)
    .render();
}
);
  main.variable(observer()).define(["md"], function(md){return(
md` This is a good improvement, but ultimately since the heatmap has two axes (Year and Genre), we will want to filter by both of those values, not just one of them.`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Therefore, we will also need to make an array with all the years in our data to later use it for our drop-down menu.`
)});
  main.variable(observer("years")).define("years", ["uniqueValid","vgsales"], function(uniqueValid,vgsales){return(
uniqueValid(vgsales, d => d.Year)
)});
  main.variable(observer()).define(["vl","genres","years","vgsales"], function(vl,genres,years,vgsales)
{  
  const selectGenre = vl.selectPoint('Select')
    .fields('Genre', 'Year')          // limit selection by both genre AND year
    .init({Genre: genres[0], Year: 2016}) // use first genre entry as initial value
    .bind({Genre: vl.menu(genres), Year: vl.menu(years)});         // bind to a menu of unique genre values
  
  // scatter plot, modify opacity based on genre selection
  return vl.markPoint({filled: true})
    .data(vgsales)
    .params(selectGenre)
    .encode(
      vl.x().fieldQ('Global_Sales')
       .scale({type: 'linear', domain: [0, 27]}),
      vl.y().fieldN('Platform'),
      vl.tooltip().fieldN('Name'), // hovering will show the name of the individual game
      vl.opacity().if(selectGenre, vl.value(1)).value(0) // opacity changes depending on the major genre
    )
    .width(950)
    .height(500)
    .render();
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`Now the next step will be to connect the two visualisations.`
)});
  main.variable(observer()).define(["md"], function(md){return(
md` The first step will be to convert to JSON format.`
)});
  main.variable(observer()).define(["VegaLite","joined"], function(VegaLite,joined){return(
VegaLite({
  data: {values: joined},
  mark: {type: "point", filled: true},
  encoding: {
    x: {field: "global_sales", type: "quantitative", scale: "linear", "domain": [0, 27]}, // y axis
    y: {field: "platform", type: "nominal", title: "platform"}, // x axis
    tooltip: {field: "Name", type: "nominal"}
    },
  "width": 950,
  "height": 500
  })
)});
  main.variable(observer()).define(["md"], function(md){return(
md `Then we can display both graphs together in the same view. This is important, because it will make it clearer that these two visualisations are connected to each other.`
)});
  main.variable(observer()).define(["VegaLite","vgsales","totalGenrePerYear"], function(VegaLite,vgsales,totalGenrePerYear){return(
VegaLite({
  data: {values: vgsales},
  vconcat: [
    {
      data: {values: totalGenrePerYear},
      layer: [{ 
          mark: {type: "rect", tooltip: true}, // The tooltip shows the data as a pop-up
          selection: {
            pts: {type: "single", on: "click"} // "mouseover" will allow for hovering
          },
          encoding: {
            y: {field: "Genre", type: "nominal", title: "Genre"}, // y axis
            x: {field: "Year", type: "nominal", title: "Year"}, // x axis
        
            color: {
              condition: {
                selection: "pts", // if cell is clicked, it is in "pts" and will be coloured
                field: "sales", type: "quantitative"
              }, // condition
              value: "gray" // everything else is gray
            } //color
          } //encoding 

      }] // layer,layer
    },
    //------------------------------------------------------------------------
    {
      data: {values: vgsales},
      layer: [{      
        mark: {type: "point", filled: true},
        encoding: {
          x: {field: "Global_Sales", type: "quantitative", scale: "linear", "domain": [0, 27]}, // y axis
          y: {field: "Platform", type: "nominal", title: "Platform"}, // x axis
          tooltip: {field: "Name", type: "nominal"}
        },
        width: 950,
        height: 500  
      }]
    }] //hconcat, vegalite
  //------------------------------------------------------------------------
})
)});
  main.variable(observer()).define(["md"], function(md){return(
md` Now we can combine the interactions for these two visualisations by having the heat-map affect the scatterplot based on where the user clicks.

When the user hovers over a cell on the heatmap, they are aided by a tooltip which tells them the genre and year they are looking at, as well as a more specific number for the total sales, which is more loosely represented by the colour of the cell.

Then, users are able to click to filter the data in the scatterplot, enabling them to look at some of the individual game titles which belonged to a particular genre that were released during a particular year.

Users are also able to compare different years and genres by holding the Shift key whilst clicking on the heatmap, which will filter the data through multiple selections instead of just one.`
)});
  main.variable(observer()).define(["VegaLite","joined","genres"], function(VegaLite,joined,genres){return(
VegaLite({
  data: {values: joined},
  vconcat: [
    //heatmap
    {
      data: {values: joined},
      layer: [{ 
          mark: {type: "rect"}, // The tooltip shows the data as a pop-up
          selection: {
            pts: {type: "multi", on:"click", encodings:["x", "y"]} // "mouseover" will allow for hovering; "click" is just a click
          },
          encoding: {
            y: {field: "genre", type: "nominal", title: "genre"}, // y axis
            x: {field: "year", type: "nominal", title: "year"}, // x axis
            tooltip:[
              {field: "genre", type: "nominal"}, 
              {field: "year", type: "nominal"},
              {field: "sales", type: "quantitative"},
              ],
            color: {
              condition: {
                selection: "pts", // if cell is clicked, it is in "pts" and will be coloured
                field: "sales", type: "quantitative"
              }, // condition
              value: "gray" // everything else is gray
            } //color
          } //encoding 

      }] // layer,layer
    },
    //------------------------------------------------------------------------
    //scatterplot
    {
      layer: [{  
        transform: [ {filter: {selection: "pts"}}],
        mark: {type:"point", filled:true},
        selection: {brush: {type: "interval"}},
        encoding: {
          x: {field: "global_sales", type: "quantitative", scale: "linear", "domain": [0, 27]}, // y axis
          y: {field: "platform", type: "nominal", title: "platform"}, // x axis
          color: {field: "genre", type: "nominal", scale: {domain: genres, "scheme": "tableau20"}}, // color of pts by genre
          tooltip: [
            {field: "name", type: "nominal"},
            {field: "genre", type: "nominal"},
            {field: "year", type: "nominal"}
        ],
        },
        width: 950,
        height: 500,
      }]
    }] //hconcat, vegalite
  //------------------------------------------------------------------------
})
)});
  main.variable(observer()).define(["md"], function(md){return(
md` <hr>
## Takeaways
When creating the visualisations, we thought about trying to implement something that would follow Shneiderman's exploratory data analysis mantra, which is "Overview first, zoom and filter, then details-on-demand."

Overall, this interactive visualization allows the user to be able to see beyond just the global sales of video game genres by year. It combines four variables (genre, year, platform, global sales) and finds correlations between them. 

The combination of a heatmap - which provides a broader overview and summary of the available data relating to video game sales over time - and the scatterplot, which allows for a closer look at certain areas of interest, follows what we expect a typical user may want to do as they explore and familiarise themselves with the data.

Furthermore, the charts used in the visualization go beyond being a simple bar-chart or line graph. By aggregating user behavior, heatmaps facilitate data analysis and give the opportunity to interact with it as they click on, scroll through, or ignore—which helps them identify trends and optimize their engagement. Scatterplots, on the other hand, bring confusing large sets of data to an understanding as certain points can be filtered out or emphasized. 
`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`
<hr>
## Teamwork

In order to create this interactive visualization, we took many pivots throughout our process. We began with the Chicago Crimes dataset and were planning on making a geomap affect a heatmap. However, the data we had was in a geojson file, which we had little documentation on how to use with Vega-Lite. There were complications with using d3 to make an interactive and advanced map. Thus, we switched to this dataset.

With this dataset, Fernanda was mostly in charge of SQL queries as she had some beginner experience using PostgreSQL and creating load files. Andrea worked more on creating the visuals with Vega-lite as she had used that language for her previous assignment. Once we had the basic queries and the basic charts made, both of us worked together to translate the Vega-lite charts to Vega-lite using JSON. Furthermore, we spent a total of about 18 hours just translating the code, learning to put two graphs in vertical view, making them interactive on their own, and finally connecting their interactivity. 

Overall, the hardest part for us was getting the heatmap to affect the scatterplot based on user touch as that took us about five hours in itself. At first we had the problem that clicking on the heatmap would clear out all the points in the scatterplot. Through looking at some online examples, we were able to get it to only show one point on the scatterplot. Finally, we played around with encoding x and y points and were able to make the interaction of the heatmap filter many points on the scatterplot.
`
)});
  return main;
}
