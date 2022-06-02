import React, { Component } from 'react';
import axios from 'axios';
import './CrudCurso.css';
import Main from './template/Main';

const title = "Cadastro de Cursos";

const urlAPI = "http://localhost:5205/api/curso";
const initialState =
{
    curso: { id: 0, nome: '', codCurso: 0 },
    lista: []
} 

export default class CrudCurso extends Component {
    state = { ...initialState }

    componentDidMount() {
        axios(urlAPI).then(resp => {
            this.setState({ lista: resp.data })
        })
    }

    limpar() {
        this.setState({ curso: initialState.curso });
    }

    salvar() {
        const curso = this.state.curso;
        curso.codCurso = Number(curso.codCurso);
        const metodo = curso.id ? 'put': 'post';
        const url = curso.id ? `${urlAPI}/${curso.id}` : urlAPI;


        axios[metodo](url, curso)
            .then(resp => {
                const lista = this.getListaAtualizada(resp.data)
                this.setState({ curso: initialState.curso, lista })
            })
    }

    getListaAtualizada(curso) {
        const lista = this.state.lista.filter(a => a.id !== curso.id);
        lista.unshift(curso)
        return lista
    }

    atualizarCampo(event) {
        //clonar usuário a partir do state, para não alterar o state diretamente 
        const curso = { ...this.state.curso };

        //usar o atributo NAME do input identificar o campo a ser atualizado
        curso[event.target.name] = event.target.value;

        //atualizar state
        this.setState({ curso });
    }

    carrgar(curso)
    {
        this.setState({curso})
    }

    remover(curso)
    {
        
        const url = urlAPI + "/" + curso.id;
        
        if(window.confirm("Confirma remoção do curso: "+ curso.nome))
        {
            console.log("entrou no confrim");

            axios['delete'](url, curso)
                .then(resp =>
                    {
                        const lista = this.getListaAtualizada(curso, true)
                        this.setState({curso: initialState.curso, lista})
                    })
        }
    }

    renderForm() {
        return (
            <div className="inclui-container">
                <label> Nome: </label>
                <input
                    type="text"
                    id="nome"
                    placeholder="Nome do curso"
                    className="form-input"
                    name="nome"

                    value={this.state.curso.nome}

                    onChange={e => this.atualizarCampo(e)}/>
                <label> Código do Curso: </label>
                <input
                    type="number"
                    id="codCurso"
                    placeholder="0"
                    className="form-input"
                    name="codCurso"

                value={this.state.curso.codCurso}
                onChange={e => this.atualizarCampo(e)}/>
                <button className="btnSalvar"
                    onClick={e => this.salvar(e)} >
                    Salvar
                </button>
                <button className="btnCancelar"
                    onClick={e => this.limpar(e)} >
                    Cancelar
                </button>
            </div>
        )
    }

    renderTable() {
        return (
            <div className="listagem">
                <table className="listacursos" id="tblListacursos">
                    <thead>
                        <tr className="cabecTabela">
                            <th className="tabTituloNome">Nome</th>
                            <th className="tabTituloCurso">Curso</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.lista.map(
                            (curso) =>

                                <tr key={curso.id}>
                                    
                                    <td>{curso.nome}</td>
                                    <td>{curso.codCurso}</td>
                                    <td>
                                        <button onClick={() =>this.carrgar(curso)}> alterar </button>
                                    </td>
                                    <td>
                                        <button onClick={() => this.remover(curso)}> Remove </button>
                                    </td>
                                </tr>
                        )}
                    </tbody>
                </table>
            </div>
        )
    }

    render() {
        return (
            <Main title={title}>
                {this.renderForm()}
                {this.renderTable()}
            </Main>
        )
    }
}