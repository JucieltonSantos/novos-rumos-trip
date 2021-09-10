import axios from "axios";
import "./App.css";
import { useEffect, useState } from "react";
import Moment from "react-moment";
import DatePicker from "react-datepicker";
import datetimeDifference from "datetime-difference";

function App() {
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [value, setValue] = useState();
  const valuePayload = {
    bounds: [
      {
        boundNumber: 0,
        departureDate: {
          start: "2021-10-01T12:11:39.451Z",
          end: "2021-10-18T12:11:39.451Z",
        },
        origin: {
          iatas: ["GRU"],
        },
        destination: {
          iatas: ["SSA"],
        },
      },
      {
        boundNumber: 1,
        departureDate: {
          start: "2021-10-01T12:11:39.451Z",
          end: "2021-10-18T12:11:39.451Z",
        },
        origin: {
          iatas: ["SSA"],
        },
        destination: {
          iatas: ["GRU"],
        },
      },
    ],
  };

  const formatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
  const onChange = (event) => {
    console.log(event);
  };
  useEffect(() => {
    axios
      .post(
        "https://bff-mall.maxmilhas.com.br/hangar/date-range",
        valuePayload,
        {
          "Content-Type": "application/json;charset=UTF-8",
        }
      )
      .then((response) => {
        const valueResponse = response.data;
        if (valueResponse) {
          setValue(valueResponse);
          setLoading(false);
        }
      });
  }, []);

  return (
    <div className="container">
      <div className="jumbotron mt-3">
        <div className="container pb-3 pt-3">
          <div className="row mb-3">
            <div class="col-3">
              <label for="InputOrigem" class="form-label">
                Origem:
              </label>
              <input
                onChange={(e) => onChange(e.target.value)}
                type="text"
                class="form-control"
                id="InputOrigem"
                aria-describedby="origem"
              />
            </div>
            <div class="col-3">
              <label for="InputOrigem" class="form-label">
                Destino:
              </label>
              <input
                type="text"
                class="form-control"
                id="InputOrigem"
                aria-describedby="origem"
              />
            </div>
            <div class="col-3">
              <label for="InputOrigem" class="form-label">
                Ida:
              </label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
              />
            </div>
            <div class="col-3">
              <label for="InputOrigem" class="form-label">
                Volta:
              </label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
              />
            </div>
          </div>
          <div className="row"></div>
          <h5>Valores enviados Ida</h5>
          <div className="card mb-3">
            <div>
              Data de Partida:{" "}
              <Moment
                format="DD/MM/YYYY"
                date={valuePayload.bounds[0].departureDate.start}
              />
            </div>
            <div>
              Data de Volta:{" "}
              <Moment
                format="DD/MM/YYYY"
                date={valuePayload.bounds[0].departureDate.end}
              />
            </div>
            <div>Origem: {valuePayload.bounds[0].origin.iatas}</div>
            <div>Destino: {valuePayload.bounds[0].destination.iatas}</div>
          </div>

          <h5>Valores enviados Volta</h5>
          <div className="card mb-3">
            <div>
              Data de Partida:{" "}
              <Moment
                format="DD/MM/YYYY"
                date={valuePayload.bounds[1].departureDate.start}
              />
            </div>
            <div>
              Data de Volta:{" "}
              <Moment
                format="DD/MM/YYYY"
                date={valuePayload.bounds[1].departureDate.end}
              />
            </div>
            <div>Origem: {valuePayload.bounds[1].origin.iatas}</div>
            <div>Destino: {valuePayload.bounds[1].destination.iatas}</div>
          </div>
        </div>
      </div>
      {loading && <div>Carregando valores</div>}
      <div>
        <h4 className="alert alertVolta">Ida e Volta</h4>
      </div>
      <div className="row mb-3">
        {value?.offers.map((res, index) => {
          const dateToFormatIda = new Date(
            res.bounds[0].departureDates[0].toString()
          );
          const dateToFormatVolta = new Date(
            res.bounds[1].departureDates[0].toString()
          );
          return (
            <div className="col-3 card">
              <div>
                <h5>Minha viagem {index === 0 ? index + 1 : index + 1}</h5>
              </div>
              <div>
                Preço Total: <b>{formatter.format(res.totalPrice)}</b>
              </div>
              <div>
                Data de Partida:{" "}
                <Moment format="DD/MM/YYYY" date={dateToFormatIda} />
              </div>
              <div>
                Data de Volta:{" "}
                <Moment format="DD/MM/YYYY" date={dateToFormatVolta} />
              </div>
              <div>
                Duração em Dias:{" "}
                {(
                  ((dateToFormatIda.getTime() - dateToFormatVolta.getTime()) /
                    (1000 * 60 * 60 * 24)) *
                  -1
                ).toFixed()}
              </div>
              <div>Origem: {res.bounds[0].origin}</div>
              <div>Destino: {res.bounds[0].destination}</div>
              <hr />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
