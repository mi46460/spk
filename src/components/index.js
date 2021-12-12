import React, { useState, useEffect } from "react";

export default function Project() {
    const [data, setData] = useState([]);
    const [payoff, setPayoff] = useState([[]]);
    const [exReturn, setExReturn] = useState([[]]);
    const [beli, setBeli] = useState("");
    const [jual, setJual] = useState("");
    const [id, setId] = useState(0);
    const [permintaan, setPermintaan] = useState("");
    const [probabilitas, setProbabilitas] = useState("");
    const [hasil, setHasil] = useState(null);

    const addData = () => {
        if (permintaan !== "" && probabilitas !== "") {
          setData([...data, { id, permintaan: parseInt(permintaan), probabilitas: parseFloat(probabilitas) }]);
          setId(id + 1);
        }
        setPermintaan("");
        setProbabilitas("");
      };
    
      const handleDeleteData = (i) => {
        const itemRemoved = data.splice(i, 1);
        setData(data.filter((data) => data !== itemRemoved));
      };
    
      const handleKeyPress = (code) => {
        if (code === "Enter") {
          addData();
        }
      };
    
      const transpose = (a) => {
        return Object.keys(a[0]).map(function (c) {
          return a.map(function (r) {
            return r[c];
          });
        });
      };
    
      const calculatePayoff = () => {
        var temp = new Array(data.length);
        for (var i = 0; i < temp.length; i++) {
          temp[i] = new Array(data.length);
        }
          for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data.length; j++) {
              if (data[j].permintaan < data[i].permintaan) {
                temp[i][j] = data[j].permintaan * jual - data[i].permintaan * beli;
              } else {
                temp[i][j] = data[i].permintaan * jual - data[i].permintaan * beli;
              }
            }
          }
    
        setPayoff(transpose(temp));
        return temp;
      };
    
      const calculateReturn = async () => {
        const payoffRef = await calculatePayoff();
        var max = 0;
        var temp = new Array(data.length);
        for (var i = 0; i < temp.length; i++) {
          temp[i] = new Array(data.length);
        }
        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < data.length; j++) {
            temp[i][j] = data[j].probabilitas * payoffRef[i][j];
          }
        }
        for (let i = 0; i < temp.length; i++) {
          var sum = 0;
          for (let j = 0; j < temp.length; j++) {
            sum += temp[i][j];
          }
          temp[i][temp.length] = sum;
          if (sum > max) {
            setHasil(i);
            max = sum;
          }
        }
        setExReturn(transpose(temp));
      };
    
      useEffect(() => {
        if (data.length > 0) calculateReturn();
      }, [data, beli, jual]);

      return(
        <div>
        <div>
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
              Harga Beli
            </label>
            <input class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            id="username" 
            type="number" 
            placeholder="masukkan nominal"
            onChange={(e) => setBeli(e.target.value)}/>
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
              Harga Jual
            </label>
            <input class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            id="username" 
            type="number" 
            placeholder="masukkan nominal"
            onChange={(e) => setJual(e.target.value)}/>
          </div>
        </div>
        <div>
        <br></br>
        <table className="divide-y divide-gray-200 bg-white mt-px border">
        <thead>
            <tr>
                <th>No.</th>
                <th>Permintaan (Unit/Hari)</th>
                <th>Probabilitas</th>
                <th></th>
                </tr>
        </thead>
        <tbody >
        {(data?.length &&
          data.map((list, i) => (
            <tr key={i}>
              <td>{i + 1}.</td>
              <td>{list.permintaan}</td>
              <td>{list.probabilitas}</td>
              <td>
                  <button onClick={() => handleDeleteData(i)}>delete</button>
              </td>
            </tr>
          ))) ||
          null}              
        <tr>
          <td >{(data?.length && data.length + 1) || 1}.</td>
          <td>
            <input
              type="number"
              value={permintaan}
              placeholder="input permintaan"
              onChange={(e) => setPermintaan(e.target.value)}
            />
          </td>
          <td>
            <input
              type="number"
              value={probabilitas}
              placeholder="input probabilitas"
              onChange={(e) => setProbabilitas(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e.key)}
            />
          </td>
          <td className="flex justify-end">
            <button onClick={addData}>add</button>
          </td>
        </tr>
      </tbody>
    </table>
    </div>
    <div>
    <br></br>
    <table className="divide-y divide-gray-200 w-3/4 bg-white mt-px">
      <thead>
        <tr>
          <td
            colSpan="1"
            rowSpan="2"
            className="text-center"
          >
            probabilitas
          </td>
          <td
            colSpan={data.length}
            className="text-center"
          >
            jumlah permintaan dan probabilitas
          </td>
        </tr>
        <tr>
          {(data?.length &&
            data.map((list, i) => (
              <td key={i}>
                {list.permintaan} = {list.probabilitas}
              </td>
            ))) || <td>-</td>}
        </tr>
      </thead>
      <tbody>
        {(data?.length &&
          data.map((list, i) => (
            <tr>
              <td key={i}>
                {list.permintaan}
              </td>
              {payoff?.length &&
                payoff.map((list, j) => (
                  <td key={j}>
                    {list[i]}
                  </td>
                ))}
            </tr>
          ))) || <td>-</td>}
      </tbody>
    </table>
    <br></br>
    <table className="divide-y divide-gray-200 w-3/4 bg-white mt-px">
          <thead>
            <tr>
              <td
                colSpan="1"
                rowSpan="2"
                className="text-center border"
              >
                expected result
              </td>
              <td
                colSpan={data.length}
                rowSpan="1"
                className="text-center border text-center"
              >
                probabilitas
              </td>
              <td
                colSpan="1"
                rowSpan="2"
                className="text-center border"
              >
                ER
              </td>
            </tr>
            <tr>
              {(data?.length &&
                data.map((list, i) => (
                  <td key={i} className="text-center font-medium border">
                    {list.probabilitas}
                  </td>
                ))) || <td>-</td>}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {(data?.length &&
              data.map((list, i) => (
                <tr>
                  <td key={i} className={`px-6 whitespace-nowrap ` + (i == hasil ? "font-bold" : "")}>
                    ER = {list.permintaan}
                  </td>
                  {exReturn?.length &&
                    exReturn.map((list, j) => (
                      <td key={j} className={`px-6 whitespace-nowrap ` + (i == hasil ? "font-bold" : "")}>
                        {list[i]}
                      </td>
                    ))}
                </tr>
              ))) || <td>-</td>}
          </tbody>
        </table>
        <p className="font-bold mt-6">Kesimpulan</p>
        {hasil ? (
          <p>
            Total produksi yang harus disediakan adalah sejumlah <b>{data[hasil].permintaan}</b>
          </p>
        ) : (
          <p>-</p>
        )}
        </div>
    </div>
      );
}