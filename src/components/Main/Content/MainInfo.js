import React, {Component} from 'react'
import * as d3 from "d3";
import * as d3tip from "d3-tip";
import * as helper from "./Helper";

class MainInfo extends Component {

    shouldComponentUpdate(nextProps, nextState){
        return nextProps.update;
    }

    render() {
        return (
            <div id='mainInfo'>
                {this.props.update?  <p style={{textAlign: 'center', margin: 30}}>Загрузка...</p>: ''}
            </div>
        )
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

        let params = this.props.params;
        let fields = this.props.fields;
        let update = this.props.update;

        if (update) {
            let dont_use = null;
            if (fields && fields.hasOwnProperty(['areas'])) {
                dont_use = fields['areas'];
            }
            const main_query = '/vacancies?' + helper.getQuery(params);

            let x = new XMLHttpRequest();
            x.open("GET", helper.HHRU + main_query, true);
            x.onload = function () {
                let jsonData = JSON.parse(x.response);

                // console.log(jsonData);
                let mainData = prepareData(jsonData, dont_use);

                let clustersData = mainData["clstrs"];
                let count = mainData["count"];

                let h2 = document.createElement("H2");
                h2.setAttribute("id", "h2");
                h2.setAttribute("style", "text-align: center");
                h2.innerHTML = "Основная информация";

                let h4 = document.createElement("H4");
                h4.setAttribute("id", "h4");
                h4.setAttribute("style", "text-align: center");
                h4.innerHTML = "Найдено вакансий: " + count;

                let mainInfoDiv = document.getElementById('mainInfo');

                mainInfoDiv.innerHTML = '';
                mainInfoDiv.appendChild(h2);
                mainInfoDiv.appendChild(h4);

                clustersData.forEach(function (clstr, it, clstrs){
                    inflateChart(clstr['clstr'], clstr['items']);

                });

            };
            x.send(null);
        }
    }
}

export default MainInfo

function prepareData(data, dont_use) {

    let clusters = data["clusters"];
    let count = data["found"];
    let clstrsData = [];

    clusters.forEach(function (clstr, it, clstrs) {
        if (clstrs[it]["id"] !== "label" && clstrs[it]["id"] !== "area") {
            let items = [];
            if (clstrs[it]["id"] === "salary") {
                clstr["items"].shift();
            }

            let n = 15;
            let k = 0;

            for (k = 0; k < clstr["items"].length && items.length < n; k++) {
                items.push(clstr["items"][k]);
            }
            if (k < clstr["items"].length) {
                let others = {
                    count: 0,
                    name: "Другие",
                    score: 0
                };
                for (; k < clstr["items"].length; k++) {
                    others['count'] += clstr["items"][k]['count']
                }
                items.push(others);
            }
            clstrsData.push({clstr: clstr, items: items});
        }
        if (clstrs[it]["id"] === "area") {

            let items = [];
            let dontUse = dont_use;
            let n = 15;
            let i = 0;
            for (i = 0; i < clstr["items"].length && items.length < n; i++) {
                let usable = true;
                for (let j = 0; j < dontUse.length && usable; j++) {
                    if (clstr["items"][i]["name"] === dontUse[j]["name"])
                        usable = false;
                }
                if (usable) {
                    items.push(clstr["items"][i]);
                }
            }
            if (i < clstr["items"].length) {
                let others = {
                    count: 0,
                    name: "Другие",
                    score: 0
                };
                for (; i < clstr["items"].length; i++) {
                    others['count'] += clstr["items"][i]['count']
                }
                items.push(others);
            }

            clstrsData.push({clstr: clstr, items: items});
        }
    });

    return {count: count, clstrs: clstrsData};
}

function inflateChart(clstr, items) {


    let chart = document.createElement("DIV");
    chart.setAttribute("class", "chart animated zoomIn");
    chart.setAttribute("id", "chart" + clstr["id"]);

    document.getElementById("mainInfo").appendChild(chart);
    let h5 = document.createElement("h5");
    h5.innerHTML = "<b>" + clstr["name"];
    document.getElementById("chart" + clstr["id"]).appendChild(h5);

    let sum = 0;
    items.forEach(function (t) {
        sum += t["count"];
    });
    items.forEach(function (t) {
        t["score"] = t["count"] / sum * 100;
    });

    if (items[0] && items[1]) {
        while (items[0]["score"] / 2.25 > items[1]["score"])
            items[0]["score"] = items[0]["score"] / 2.25;
        let n = items.length;
        while (items[n-1]["score"] / 2.25 > items[0]["score"])
            items[n-1]["score"] = items[n-1]["score"] / 2.25;
    }

    let data = [];
    // let cols = ["#00ffff", "#ff8000", "#ffff00", "#80ff07", "#00ffbf", "#ffbf00", "#00bfff", "#0040ff", "#ff00ff", "#00CED1", "#008000", "#F08080", "#FF6347", "#FFFFFF", "#C0C0C0", "#800000", "#008080", "#FFB6B9", "#81CBC8", "#ECFAFB", "#65EEB7", "#5FCC9C", "#FFF195"];
    let cls = ["#9E0041", "#C32F4B", "#E1514B", "#F47245", "#FB9F59", "#FEC574", "#FAE38C", "#EAF195", "#C7E89E", "#9CD6A4", "#6CC4A4", "#4D9DB4", "#4776B4", "#5E4EA1"];
    items.forEach(function (t, it) {
        data.push({
            id: it,
            order: it,
            weight: 1,
            label: t["name"],
            score: t["score"],
            color: cls[parseInt(Math.random() * (cls.length - 1))],
            width: 1,
            count: t["count"]
        });
    });

    let width = 200,
        height = 200,
        radius = Math.min(width, height) / 2,
        innerRadius = 0.4 * radius;

    let max = Math.max(items[0]["score"], items[items.length - 1]['score']);


    let pie = d3.pie()
        .sort(null)
        .value(function (d) {
            return d.width;
        });

    let tip = d3tip()
        .attr('class', 'd3-tip')
        .offset([0, 0])
        .html(function (d) {
            return d.data.label + ": <span style='color:orangered'>" + (d.data.count / sum * 100).toFixed(2) + "\%</span>";
        });

    let arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(function (d) {
            return (radius - innerRadius) * (d.data.score / max) + innerRadius;
        });

    let outlineArc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(radius);

    let svg = d3.select("#chart" + clstr["id"]).append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    svg.call(tip);

    data.forEach(function (d, it, ds) {
        d.id = d.id;
        d.order = +d.order;
        d.color = d.color;
        d.weight = +d.weight;
        d.score = +d.score;
        d.width = +d.weight;
        d.label = d.label;
    });


    let outerPath = svg.selectAll(".outlineArc")
        .data(pie(data))
        .enter()
        .append("path")
        .attr("fill", "#FFF")
        .attr("stroke", "gray")
        .attr("class", "outlineArc")
        .attr("d", outlineArc)
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

    let path = svg.selectAll(".solidArc")
        .data(pie(data))
        .enter()
        .append("path")
        .attr("fill", function (d) {
            return d.data.color;
        })
        .attr("class", "solidArc")
        .attr("stroke", "gray")
        .attr("d", arc)
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

    svg.append("svg:text")
        .attr("class", "aster-score")
        .attr("dy", ".35em")
        .attr("text-anchor", "middle"); // text-align: right
}