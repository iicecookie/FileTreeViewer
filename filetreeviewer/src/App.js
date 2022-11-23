import React, { Component } from 'react';
import TreeDataView from './Components/TreeDataView'

export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            file: null,
            fileContent: null,
            employees: null
        };
    } 

    handleFileChange = (e) => {
        if (e.target.files) {
            this.setState({ file: e.target.files[0] })

            const reader = new FileReader()
            reader.onload = (e) => { 
                this.setState({ fileContent: reader.result }) 
            }
            reader.readAsText(e.target.files[0])
        }
    };

    handleUploadClick = (e) => {
        if (this.state.fileContent === null) {
            alert('Данные файла не загружены')
            return;
        }

        fetch("https://localhost:7052/ContentDecode/GetDecodedString", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                encodedString: this.state.fileContent
            })
        })
            .then((res) => res.json())
            .then((data) => {
                this.setState({ employees: data })
            })  
            .catch((err) => console.error(err));
    }

    render() {

        return (
            <div className="root">
                <div className="card shadow">
                    <h2 id="tabelLabel">Отображение содержимого в base64 файла в виде таблицы</h2>
                     
                    <label>Выберите файл для отображения: </label>
                     
                    <label htmlFor="file-upload" className="custom-file-upload"> 
                        Загрузить файл
                    </label>
                    <input id="file-upload" type="file" onChange={this.handleFileChange}/>
                     
                    <button className="customBtn" onClick={this.handleUploadClick}>
                        Отобразить содержимое
                    </button>
                </div> 
                {
                    this.state.employees != null &&
                    <TreeDataView style="" employees={this.state.employees} />
                }
            </div>
        );
    }
}
