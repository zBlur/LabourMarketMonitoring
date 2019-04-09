import React, {Component} from 'react'
import Select from './FormComponents/Select'
import DateBox from './FormComponents/DateBox'

class Form extends Component {

    state = {
        fields: this.props.fields,
        countries: null,
        regions: null,
        cities: null,
        industries: null,
        underIndustries: null,
        profFields: null,
        specializations: null,
        vacancy_search_fields: this.props.fields["dictionaries"]['vacancy_search_fields'],
        vacancy_search_order: this.props.fields["dictionaries"]["vacancy_search_order"],
        experience: this.props.fields["dictionaries"]["experience"],
        employment: this.props.fields["dictionaries"]["employment"],
        schedule: this.props.fields["dictionaries"]["schedule"]
    };

    componentWillMount() {
        const {fields} = this.state;

        const countries = fields['areas'];

        let regions = [];
        for (let i = 0; i < countries.length; i++) {
            regions = regions.concat(countries[i]['areas']);
        }
        regions.sort(function (a, b) {
                if (a['name'] > b['name']) {
                    return 1;
                }
                if (a['name'] < b['name']) {
                    return -1;
                }
                // a должно быть равным b
                return 0;
            }
        );

        let cities = [];
        for (let i = 0; i < regions.length; i++) {
            cities = cities.concat(regions[i]['areas']);
        }
        cities.sort(function (a, b) {
                if (a['name'] > b['name']) {
                    return 1;
                }
                if (a['name'] < b['name']) {
                    return -1;
                }
                // a должно быть равным b
                return 0;
            }
        );

        const industries = fields['industries'];
        industries.sort(function (a, b) {
                if (a['name'] > b['name']) {
                    return 1;
                }
                if (a['name'] < b['name']) {
                    return -1;
                }
                // a должно быть равным b
                return 0;
            }
        );

        let underIndustries = [];
        for (let i = 0; i < industries.length; i++) {
            underIndustries = underIndustries.concat(industries[i]['industries']);
        }
        underIndustries.sort(function (a, b) {
                if (a['name'] > b['name']) {
                    return 1;
                }
                if (a['name'] < b['name']) {
                    return -1;
                }
                // a должно быть равным b
                return 0;
            }
        );

        const profFields = fields['specializations'];
        profFields.sort(function (a, b) {
                if (a['name'] > b['name']) {
                    return 1;
                }
                if (a['name'] < b['name']) {
                    return -1;
                }
                // a должно быть равным b
                return 0;
            }
        );

        let specializations = [];
        for (let i = 0; i < profFields.length; i++) {
            specializations = specializations.concat(profFields[i]['specializations']);
        }
        specializations.sort(function (a, b) {
                if (a['name'] > b['name']) {
                    return 1;
                }
                if (a['name'] < b['name']) {
                    return -1;
                }
                // a должно быть равным b
                return 0;
            }
        );

        this.setState({
            fields: this.props.fields,
            countries: countries,
            regions: regions,
            cities: cities,
            industries: industries,
            underIndustries: underIndustries,
            profFields: profFields,
            specializations: specializations,
            vacancy_search_fields: this.props.fields["dictionaries"]['vacancy_search_fields'],
            vacancy_search_order: this.props.fields["dictionaries"]["vacancy_search_order"],
            experience: this.props.fields["dictionaries"]["experience"],
            employment: this.props.fields["dictionaries"]["employment"],
            schedule: this.props.fields["dictionaries"]["schedule"]
        })
    }

    render() {

        const country = {id: 'country', name: "Страна", array: this.state.countries, func: this.countryOnClick};

        const region = {id: 'region', name: "Регион", array: this.state.regions, func: this.regionOnClick};

        const city = {id: "city", name: "Город", array: this.state.cities};

        const industry = {id: "industry", name: "Индустрия", array: this.state.industries, func: this.industryOnClick};

        const underIndustry = {id: "underIndustry", name: "Отрасль", array: this.state.underIndustries};

        const profField = {
            id: "profField",
            name: "Профобласть",
            array: this.state.profFields,
            func: this.profFieldOnClick
        };

        const specialization = {id: "specialization", name: "Специализация", array: this.state.specializations};

        const vacancy_search_fields = {
            id: "vacancy_search_fields",
            name: "Искать только",
            array: this.state.vacancy_search_fields
        };

        const vacancy_search_order = {
            id: "vacancy_search_order",
            name: "Сортировать",
            array: this.state.vacancy_search_order
        };
        const experience = {id: "experience", name: "Опыт работы", array: this.state.experience};
        const employment = {id: "employment", name: "Тип занятости", array: this.state.employment};
        const schedule = {id: "schedule", name: "График работы", array: this.state.schedule};


        return (
            <div>
                <DateBox params={{id: "date_from", text: "От"}}/>
                <DateBox params={{id: "date_to", text: "До"}}/>

                <Select params={country}/>
                <Select params={region}/>
                <Select params={city}/>
                <Select params={industry}/>
                <Select params={underIndustry}/>
                <Select params={profField}/>
                <Select params={specialization}/>
                <Select params={vacancy_search_fields}/>
                <Select params={vacancy_search_order}/>
                <Select params={experience}/>
                <Select params={employment}/>
                <Select params={schedule}/>

            </div>
        )
    }

    countryOnClick = () => {

        let slct = document.getElementById("country");
        let slctd = slct.options[slct.options.selectedIndex];
        let regions = [];

        if (slctd["value"] === '-1') {
            for (let i = 0; i < this.state.countries.length; i++)
                regions = regions.concat(this.state.countries[i]["areas"]);

        }
        else {
            let val = slctd["value"];

            for (let i = 0; i < this.state.countries.length; i++)
                if (this.state.countries[i]["id"] === val)
                    regions = regions.concat(this.state.countries[i]["areas"]);
        }
        regions.sort(function (a, b) {
                if (a['name'] > b['name']) {
                    return 1;
                }
                if (a['name'] < b['name']) {
                    return -1;
                }
                // a должно быть равным b
                return 0;
            }
        );

        let cities = [];
        for (let i = 0; i < regions.length; i++) {
            cities = cities.concat(regions[i]['areas']);
        }
        cities.sort(function (a, b) {
                if (a['name'] > b['name']) {
                    return 1;
                }
                if (a['name'] < b['name']) {
                    return -1;
                }
                // a должно быть равным b
                return 0;
            }
        );

        this.setState({
            regions: regions,
            cities: cities
        });
    };

    regionOnClick = () => {
        let slct = document.getElementById("region");
        let slctd = slct.options[slct.options.selectedIndex];
        let cities = [];

        if (slctd["value"] === '-1') {
            for (let i = 0; i < this.state.regions.length; i++)
                cities = cities.concat(this.state.regions[i]["areas"]);

        }
        else {
            let val = slctd["value"];

            for (let i = 0; i < this.state.regions.length; i++)
                if (this.state.regions[i]["id"] === val)
                    cities = cities.concat(this.state.regions[i]["areas"]);
        }
        cities.sort(function (a, b) {
                if (a['name'] > b['name']) {
                    return 1;
                }
                if (a['name'] < b['name']) {
                    return -1;
                }
                // a должно быть равным b
                return 0;
            }
        );

        this.setState({cities: cities});
    };

    industryOnClick = () => {
        let slct = document.getElementById("industry");
        let slctd = slct.options[slct.options.selectedIndex];
        let underIndustries = [];

        if (slctd["value"] === '-1') {
            for (let i = 0; i < this.state.industries.length; i++)
                underIndustries = underIndustries.concat(this.state.industries[i]["industries"]);

        }
        else {
            let val = slctd["value"];

            for (let i = 0; i < this.state.industries.length; i++)
                if (this.state.industries[i]["id"] === val)
                    underIndustries = underIndustries.concat(this.state.industries[i]["industries"]);
        }
        underIndustries.sort(function (a, b) {
                if (a['name'] > b['name']) {
                    return 1;
                }
                if (a['name'] < b['name']) {
                    return -1;
                }
                // a должно быть равным b
                return 0;
            }
        );

        this.setState({underIndustries: underIndustries});
    };

    profFieldOnClick = () => {

        let slct = document.getElementById("profField");
        let slctd = slct.options[slct.options.selectedIndex];
        let specializations = [];

        if (slctd["value"] === '-1') {
            for (let i = 0; i < this.state.profFields.length; i++)
                specializations = specializations.concat(this.state.profFields[i]["specializations"]);

        }
        else {
            let val = slctd["value"];

            for (let i = 0; i < this.state.profFields.length; i++)
                if (this.state.profFields[i]["id"] === val)
                    specializations = specializations.concat(this.state.profFields[i]["specializations"]);
        }
        specializations.sort(function (a, b) {
                if (a['name'] > b['name']) {
                    return 1;
                }
                if (a['name'] < b['name']) {
                    return -1;
                }
                // a должно быть равным b
                return 0;
            }
        );

        this.setState({specializations: specializations});
    }
}


export default Form
