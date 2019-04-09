import React, {Component} from 'react';
import sweetAlert from 'sweetalert/dist/sweetalert.min'


class InputSearch extends Component {

    getSelectedValueById(id) {
        if (document.getElementById(id) && document.getElementById(id).options.selectedIndex > 0) {
            let s = document.getElementById(id).options;
            s = s[s.selectedIndex];
            return s.value;
        }
        return null;
    }

    getDate() {
        let from = document.getElementById("date_from");
        let to = document.getElementById("date_to");
        if (from && to && from.value !== '') {
            from = Date.parse(from.value);

            if (to.value !== '')
                to = Date.parse(to.value);
            else
                to = new Date();

            if (from <= to && to <= (new Date())) {

                from = new Date(from);
                to = new Date(to);

                let from_y = from.getFullYear();
                let from_m = from.getMonth() + 1;
                let from_d = from.getDate();
                if (from_d < 10)
                    from_d = '0' + from_d;

                if (from_m < 10)
                    from_m = '0' + from_m;

                let to_y = to.getFullYear();
                let to_m = to.getMonth() + 1;
                let to_d = to.getDate();
                if (to_d < 10)
                    to_d = '0' + to_d;

                if (to_m < 10)
                    to_m = '0' + to_m;

                return {
                    "date_from": from_y + '-' + from_m + '-' + from_d,
                    "date_to": to_y + '-' + to_m + '-' + to_d
                };
            }
            else {
                sweetAlert(
                    {
                        title: 'Внимание!',
                        text: "Поиск произведен без учета даты. Неверно заданы границы дат.",
                        button: 'закрыть'
                    })
            }
        }
        else if (to && to.value !== '' && from && from.value === '') {
            sweetAlert({
                title: 'Внимание!',
                text: 'Поиск произведен без учета даты. Для поиска с учетом даты укажите нижнюю границу даты поиска.',
                button: 'закрыть'
            });
        }
        return false;
    }

    onClick = () => {
        if(!this.props.update){
            let paramsObj = {};

            paramsObj['text'] = document.getElementById("inputSearch").value;

            let dates = this.getDate();

            if (dates) {
                paramsObj["date_from"] = dates['date_from'];
                paramsObj["date_to"] = dates['date_to'];
            }

            paramsObj['area'] = (this.getSelectedValueById("city") || this.getSelectedValueById("region") || this.getSelectedValueById("country"));
            paramsObj["specialization"] = (this.getSelectedValueById("specialization") || this.getSelectedValueById("profField"));
            paramsObj["industry"] = (this.getSelectedValueById("underIndustry") || this.getSelectedValueById("industry"));
            paramsObj["search_field"] = this.getSelectedValueById("vacancy_search_fields");
            paramsObj['experience'] = this.getSelectedValueById("experience");
            paramsObj['employment'] = this.getSelectedValueById("employment");
            paramsObj['schedule'] = this.getSelectedValueById("schedule");
            paramsObj['order_by'] = this.getSelectedValueById("vacancy_search_order");
            paramsObj['clusters'] = true;
            this.props.onParamsChange(paramsObj);
            this.props.onUpdateChange(true);
            // console.log('InputSearch:', paramsObj);
        }
        else{
            sweetAlert(
                {
                    // title: '',
                    text: "В данный момент идет процесс сборки информации.\nПожулуйста, подождите.",
                    button: 'закрыть'
                })
        }


    };

    render() {
        return (
            <div className="input-group" style={{marginBottom: 5, marginLeft: 15, marginRight: 15}}>
                <input id="inputSearch" type="text" className="form-control" placeholder="Что ищем?"/>
                <span className="input-group-btn">
                        <button id={'buttonSearch'} onClick={this.onClick} className="btn btn-secondary "
                                style={{borderBottomLeftRadius: '0', borderTopLeftRadius: '0'}}
                                type="button" datasrc="">поиск</button>
                    </span>
            </div>
        )
    }
}

export default InputSearch