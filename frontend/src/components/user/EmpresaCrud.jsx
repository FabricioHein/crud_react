import React, { Component } from 'react'
import axios from 'axios'
import Main from '../template/Main'

const headerProps = {
    icon: 'money',
    title: 'Empresa',
    subtitle: 'Cadastro de usuários: Incluir, Listar, Alterar e Excluir!'
}

const baseUrl = 'http://localhost:3001/empresas'
const initialState = {
    empresa: { empresa: '', email: '' , telefone: '', tipo: ''},
    list: []
}

export default class empresaCrud extends Component {

    state = { ...initialState }

    componentWillMount() {
        axios(baseUrl).then(resp => {
            this.setState({ list: resp.data })
        })
    }

    clear() {
        this.setState({ empresa: initialState.empresa })
    }

    save() {
        const empresa = this.state.empresa
        const method = empresa.id ? 'put' : 'post'
        const url = empresa.id ? `${baseUrl}/${empresa.id}` : baseUrl
        axios[method](url, empresa)
            .then(resp => {
                const list = this.getUpdatedList(resp.data)
                this.setState({ empresa: initialState.empresa, list })
            })
    }

    getUpdatedList(empresa, add = true) {
        const list = this.state.list.filter(u => u.id !== empresa.id)
        if(add) list.unshift(empresa)
        return list
    }

    updateField(event) {
        const empresa = { ...this.state.empresa }
        empresa[event.target.name] = event.target.value
        this.setState({ empresa })
    }

    renderForm() {
        return (
            <div className="form">
                <div className="row">
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Empresa</label>
                            <input type="text" className="form-control"
                                name="name"
                                value={this.state.empresa.name}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite o nome..." />
                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>E-mail</label>
                            <input type="text" className="form-control"
                                name="email"
                                value={this.state.empresa.email}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite o e-mail..." />
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Telefone</label>
                            <input type="text" className="form-control"
                                name="telefone"
                                value={this.state.empresa.telefone}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite o telefone..." />
                        </div>
                    </div>
                </div>
                

                <hr />
                <div className="row">
                    <div className="col-12 d-flex justify-content-end">
                        <button className="btn btn-primary"
                            onClick={e => this.save(e)}>
                            Salvar
                        </button>

                        <button className="btn btn-secondary ml-2"
                            onClick={e => this.clear(e)}>
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    load(empresa) {
        this.setState({ empresa })
    }

    remove(empresa) {
        axios.delete(`${baseUrl}/${empresa.id}`).then(resp => {
            const list = this.getUpdatedList(empresa, false)
            this.setState({ list })
        })
    }

    renderTable() {
        return (
            <table className="table mt-4">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>E-mail</th>
                        <th>Telefone</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderRows()}
                </tbody>
            </table>
        )
    }

    renderRows() {
        return this.state.list.map(empresa => {
            return (
                <tr key={empresa.id}>
                    <td>{empresa.id}</td>
                    <td>{empresa.name}</td>
                    <td>{empresa.email}</td>
                    <td>{empresa.telefone}</td>

                    <td>
                        <button className="btn btn-warning"
                            onClick={() => this.load(empresa)}>
                            <i className="fa fa-pencil"></i>
                        </button>
                        <button className="btn btn-danger ml-2"
                            onClick={() => this.remove(empresa)}>
                            <i className="fa fa-trash"></i>
                        </button>
                    </td>
                </tr>
            )
        })
    }
    
    render() {
        return (
            <Main {...headerProps}>
                {this.renderForm()}
                {this.renderTable()}
            </Main>
        )
    }
}