import React, {Component} from 'react'
import * as d3 from "d3";
import * as d3tip from "d3-tip";
import * as helper from "./Helper";

class DetailedInfo extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.update;
    }

    render() {
        let params = this.props.params;
        let fields = this.props.fields;
        let update = this.props.update;

        return (
            <div id='detailedInfo'>
                {this.props.update ?
                    <p id={'detailedInfoP'} style={{textAlign: 'center', margin: 30}}>Загрузка...</p> : ''}
            </div>
        )
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        let params = this.props.params;
        let fields = this.props.fields;
        let update = this.props.update;
        let onUpdateChange = this.props.onUpdateChange;

        if (update) {
            let detailedInfo = document.getElementById("detailedInfo");

            let detailedInfoP = document.getElementById('detailedInfoP');

            detailedInfo.innerHTML = '';
            detailedInfoP.innerHTML = 'Загрузка(0%)';
            detailedInfo.appendChild(detailedInfoP);

            let currencies = fields["dictionaries"]["currency"];
            let dates = generateDates(params);

            let pars = ['text', 'area', "specialization", "industry", "search_field", 'experience', 'employment', 'schedule', 'order_by'];
            let query = '/vacancies?' + helper.getQuery(params, pars);

            let vacancies = {};
            let i = 0;
            setTimeout(function func(query, i) {
                if (i < dates.length) {
                    let x = new XMLHttpRequest();
                    x.open("GET", helper.HHRU + query + "&date_from=" + dates[i]['date_from'] + '&date_to=' + dates[i]['date_to'] + "&per_page=100&page=0", true);
                    x.onload = function () {
                        vacancies[dates[i]['date_from']] = JSON.parse(x.response);
                        i++;
                        detailedInfoP.innerHTML = 'Загрузка(' + (Math.round(i / dates.length * 100 * 10) / 10) + '%)';
                        setTimeout(func, 60, query, i)
                    };
                    x.send(null);
                }
                else {
                    // detailedInfo.innerHTML = '';
                    detailedInfoP.innerHTML = '';
                    let h2 = document.createElement("H2");
                    h2.setAttribute("style", "text-align: center");
                    h2.innerHTML = "Подробная информация";
                    detailedInfo.appendChild(h2);

                    let div = document.createElement("DIV");
                    div.setAttribute('id', 'divCounts');
                    div.setAttribute("width", '100%');
                    div.setAttribute("height", '400');
                    detailedInfo.appendChild(div);
                    let div1 = document.createElement("DIV");
                    div1.setAttribute('id', 'divSalaries');
                    div1.setAttribute("width", '100%');
                    div1.setAttribute("height", '400');
                    detailedInfo.appendChild(div1);
                    let div2 = document.createElement("DIV");
                    div2.setAttribute('id', 'divSMOOTHSalaries');
                    div2.setAttribute("width", '100%');
                    div2.setAttribute("height", '400');
                    detailedInfo.appendChild(div2);

                    detailedInfo.appendChild(detailedInfoP);

                    showDetailedInfo(vacancies, currencies, detailedInfo, onUpdateChange);
                }

            }, 60, query, i);
        }
    }
}

export default DetailedInfo


function showDetailedInfo(vacancies, currencies, detailedInfo, onUpdateChange) {
    let counts = [];
    let salaries = [];
    let salaries_dict = {};
    let greatest_salary = 0;
    let best_vac = null;
    let vacancies_dict = {};

    for (let k in vacancies) {

        if (vacancies.hasOwnProperty(k)) {
            counts.push({date: k, value: vacancies[k]['found']});

            let salarySum = 0;
            let average = 0;
            let count = 0;

            vacancies[k]['items'].forEach(function (item, i, items) {
                vacancies_dict[item['id']] = item;

                let it_salary = item['salary'];
                if (it_salary != null && it_salary.hasOwnProperty('from') && +it_salary['from'] > 0) {
                    count++;

                    it_salary["from"] = +it_salary["from"];
                    // it_salary['to'] = it_salary["to"] ? +it_salary["to"] : 0;

                    let s_currency = it_salary["currency"];
                    if (s_currency !== 'RUR') {
                        currencies.forEach(function (value) {

                            if (value['code'] === s_currency) {
                                it_salary["from"] = Math.ceil(it_salary["from"] / value["rate"]);
                                // it_salary["to"] = it_salary["to"] ? Math.ceil(it_salary["to"] / value["rate"]) : 0;
                                it_salary["currency"] = 'RUR';
                            }
                        });
                    }

                    it_salary["avg"] = it_salary["from"];

                    salarySum += +it_salary['from'];
                    if (it_salary['from'] > greatest_salary) {
                        best_vac = item;
                        greatest_salary = it_salary['from']
                    }

                    salaries_dict[item['id']] = it_salary;
                }
            });
            if (salarySum > 0 && vacancies[k]['items'].length > 0) {
                // average = salarySum / vacancies[k]['items'].length;
                average = salarySum / count;
            }
            salaries.push({date: k, value: average})
        }
    }


    let smooth_salaries = salary_smoothing(salaries);

    inflateGraph('divCounts', counts, 'Количество вакансий');

    // inflateGraph('divSalaries', salaries, 'Средняя зарплата(руб)');

    inflateGraph('divSMOOTHSalaries', smooth_salaries, 'Средняя зарплата(руб)');

    let hr = document.createElement("HR");

    let detailedInfoP = document.getElementById('detailedInfoP');
    detailedInfo.removeChild(detailedInfoP);

    detailedInfo.appendChild(hr);
    detailedInfo.appendChild(detailedInfoP);

    let keySkill_dict = {};
    let full_vac_dict = {};

    let vac_size = Object.size(vacancies_dict);
    let i = 0;
    setTimeout(function func(i) {
        if (i < vac_size) {
            let x = new XMLHttpRequest();
            x.open("GET", helper.HHRU + '/vacancies/' + Object.keys(vacancies_dict)[i], true);
            x.onload = function () {
                let jsonData = JSON.parse(x.response);
                vacancies_dict[Object.keys(vacancies_dict)[i]]["full_info"] = jsonData;
                full_vac_dict[Object.keys(vacancies_dict)[i]] = jsonData;
                let keySkills_item = jsonData['key_skills'];
                keySkills_item.forEach(function (item, i, items) {
                    if (keySkill_dict.hasOwnProperty(item['name']))
                        keySkill_dict[item['name']] += 1;
                    else
                        keySkill_dict[item['name']] = 1;
                });
                i++;
                detailedInfoP.innerHTML = 'Загрузка(' + (Math.round(i / vac_size * 100 * 10) / 10) + '%)';
                setTimeout(func, 4, i)
            };
            x.send(null);
        }
        else {
            detailedInfoP.innerHTML = '';
            let count = 20;

            let sortable_keySkill_popular = [];
            for (let key in keySkill_dict) {
                if (keySkill_dict.hasOwnProperty(key))
                    sortable_keySkill_popular.push([key, keySkill_dict[key]]);
            }
            sortable_keySkill_popular.sort(function (a, b) {
                return b[1] - a[1];
            });

            let sortable_salaries_cheapest = [];
            for (let key in salaries_dict) {
                if (salaries_dict.hasOwnProperty(key)) {
                    sortable_salaries_cheapest.push([key, salaries_dict[key]['avg']])
                }
            }
            sortable_salaries_cheapest.sort(function (a, b) {
                return b[1] - a[1];
            });
            let cheapest_salaries = sortable_salaries_cheapest.slice(0, Math.floor(0.25 * sortable_salaries_cheapest.length));

            keySkill_dict = {};

            cheapest_salaries.forEach(function (item, i, items) {
                let vac = full_vac_dict[item[0]];
                if (vac) {
                    let key_skills = vac['key_skills'];
                    key_skills.forEach(function (key, j, keys) {
                        if (keySkill_dict.hasOwnProperty(key['name']))
                            keySkill_dict[key['name']] += 1;
                        else
                            keySkill_dict[key['name']] = 1;
                    });
                }

            });

            let sortable_keySkill_cheapest = [];
            for (let key in keySkill_dict) {
                if (keySkill_dict.hasOwnProperty(key))
                    sortable_keySkill_cheapest.push([key, keySkill_dict[key]]);
            }
            sortable_keySkill_cheapest.sort(function (a, b) {
                return b[1] - a[1];
            });

            // console.log(sortable_keySkill_popular.slice(0, count));
            // console.log(sortable_keySkill_cheapest.slice(0, count));
            let div = document.createElement('DIV');
            div.setAttribute('class', 'row');

            let divPopularSkills = document.createElement("DIV");
            divPopularSkills.setAttribute('id', 'divPopularSkills');
            divPopularSkills.setAttribute('class', 'col-xs-6 col-md-6');
            div.appendChild(divPopularSkills);

            let divCheapestSkills = document.createElement("DIV");
            divCheapestSkills.setAttribute('id', 'divCheapestSkills');
            divCheapestSkills.setAttribute('class', 'col-xs-6 col-md-6');

            div.appendChild(divCheapestSkills);
            detailedInfo.appendChild(div);

            inflateUL('divPopularSkills', 'Распространенные навыки', sortable_keySkill_popular.slice(0, count));
            inflateUL('divCheapestSkills', 'Ценные навыки', sortable_keySkill_cheapest.slice(0, count));

            onUpdateChange(false);
        }
    }, 5, i);
}

Object.size = function (obj) {
    let size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

function inflateUL(id, title, arr) {
    let n = arr.length;
    let div = document.getElementById(id);

    let h4 = document.createElement("H4");
    h4.setAttribute("style", "text-align: center");
    h4.innerHTML = title;


    let ul = document.createElement('UL');
    ul.setAttribute('class', 'list-group');

    for (let i = 0; i < n; i++) {
        let li = document.createElement('LI');
        li.setAttribute('class', 'list-group-item d-flex justify-content-between align-items-center');
        li.innerHTML = arr[i][0];

        let span = document.createElement('SPAN');
        span.setAttribute('class', 'badge badge-primary badge-pill');
        span.innerHTML = arr[i][1];

        li.appendChild(span);
        ul.appendChild(li);
    }
    div.appendChild(h4);
    div.appendChild(ul);
}


function generateDates(params) {
    let date_from = params['date_from'] ? new Date(Date.parse(params['date_from'])) : new Date(new Date().setDate(new Date().getDate() - 30));
    let date_to = params['date_to'] ? new Date(Date.parse(params['date_to'])) : new Date();

    let dates = [];

    do {
        let to = new Date(date_to);

        let to_y = to.getFullYear();
        let to_m = to.getMonth() + 1;
        let to_d = to.getDate();

        if (to_d < 10)
            to_d = '0' + to_d;

        if (to_m < 10)
            to_m = '0' + to_m;

        date_to.setDate(date_to.getDate() - 1);

        dates.push({
            "date_from": to_y + '-' + to_m + '-' + to_d,
            "date_to": to_y + '-' + to_m + '-' + to_d
        });
    }
    while (date_to >= date_from);
    return dates;
}

function salary_smoothing(salaries) {
    salaries = salaries.reverse();
    let slrs = new Array(salaries.length);
    salaries.forEach(function (item, i, items) {
        slrs[i] = item['value'];
    });
    let new_slrs = Array.from(slrs);
    let avg_slr = 0;
    new_slrs.forEach(function (item, items) {
        avg_slr += item;
    });
    avg_slr /= new_slrs.length;
    new_slrs[0] = avg_slr;
    let s_sq_sum = 0;
    for (let k = 1; k < new_slrs.length; k++) {
        s_sq_sum += Math.pow(new_slrs[k] - avg_slr, 2);
    }
    s_sq_sum = Math.sqrt(s_sq_sum / (new_slrs.length - 1));
    let lambdas = new Array(new_slrs.length);
    lambdas[0] = 0;
    for (let k = 1; k < new_slrs.length; k++) {
        lambdas[k] = Math.abs(new_slrs[k - 1] - new_slrs[k]) / s_sq_sum;
    }
    lambdas.forEach(function (item, it, items) {
        if (item > 1.2) {
            new_slrs[it] = avg_slr;
        }
    });
    let alpha = 0.5;
    for (let k = 1; k < new_slrs.length; k++) {
        new_slrs[k] = alpha * new_slrs[k] + (1 - alpha) * new_slrs[k - 1];
    }

    // console.log(new_slrs);
    let result = [];
    new_slrs.forEach(function (item, it, items) {
        result.push({date: salaries[it]['date'], value: item})
    });

    return result
}

function inflateGraph(id, counts, info) {
    let margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 825 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    let parseTime = d3.timeParse("%Y-%m-%d");

    let x = d3.scaleTime().range([0, width]);
    let y = d3.scaleLinear().range([height, 0]);

    let valueline = d3.line()
        .x(function (d) {
            return x(d.date);
        })
        .y(function (d) {
            return y(d.close);
        });

    let svg = d3.select("#" + id).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


    counts.forEach(function (d) {
        d.date = parseTime(d['date']);
        d.close = +d['value'];
    });

    x.domain(d3.extent(counts, function (d) {
        return d.date;
    }));
    y.domain([0, d3.max(counts, function (d) {
        return d.close;
    })]);

    svg.append("path")
        .data([counts])
        .attr("class", "line")
        .attr("d", valueline);

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b-%d")));

    svg.append("g")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("fill", "#000")
        // .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "1em")
        .attr("font-size", "14")
        .attr("text-anchor", "start")
        .text(info);
}

if (!Object.keys) {
    Object.keys = (function () {
        'use strict';
        let hasOwnProperty = Object.prototype.hasOwnProperty,
            hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
            dontEnums = [
                'toString',
                'toLocaleString',
                'valueOf',
                'hasOwnProperty',
                'isPrototypeOf',
                'propertyIsEnumerable',
                'constructor'
            ],
            dontEnumsLength = dontEnums.length;

        return function (obj) {
            if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
                throw new TypeError('Object.keys called on non-object');
            }

            let result = [], prop, i;

            for (prop in obj) {
                if (hasOwnProperty.call(obj, prop)) {
                    result.push(prop);
                }
            }

            if (hasDontEnumBug) {
                for (i = 0; i < dontEnumsLength; i++) {
                    if (hasOwnProperty.call(obj, dontEnums[i])) {
                        result.push(dontEnums[i]);
                    }
                }
            }
            return result;
        };
    }());
}