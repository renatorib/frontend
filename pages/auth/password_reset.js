import {Component, Fragment} from 'react'
import Form from 'components/shared/Common/Form'
import Errors from 'components/shared/Common/Errors'
import EmCasaButton from 'components/shared/Common/Buttons'
import {getCookie, removeCookie} from 'lib/session'
import {resetPassword, redirectIfAuthenticated} from 'lib/auth'
import isArray from 'lodash/isArray'
import flattenDeep from 'lodash/flattenDeep'

export default class PasswordReset extends Component {
  state = {
    errors: [],
    loading: false
  }

  static getInitialProps(ctx) {
    if (redirectIfAuthenticated(ctx)) {
      return {}
    } else {
      const {token} = ctx.req.params
      const success = getCookie('success', ctx.req)

      if (success) {
        removeCookie('success')
      }
      return {
        success,
        token,
        renderFooter: false
      }
    }
  }

  handleSubmit = async (e) => {
    e.preventDefault()
    this.setState({errors: [], loading: true})
    const password = e.target.elements.password.value
    const password_confirm = e.target.elements.password_confirm.value
    const {token} = this.props
    try {
      let data = await resetPassword(password, password_confirm, token)
      this.setState({data})
    } catch (e) {
      const errors = isArray(e)
        ? e
        : [e.data ? flattenDeep(Object.values(e.data.errors)) : e]
      this.setState({errors, loading: false})
    }
  }

  render() {
    const {errors, loading} = this.state
    return (
      <Fragment>
        <Form onSubmit={this.handleSubmit}>
          <h1>Resetar Senha</h1>
          <p>Digite abaixo sua senha nova.</p>
          <input type="password" placeholder="Senha" name="password" />
          <input
            type="password"
            placeholder="Digite novamente sua senha"
            name="password_confirm"
          />

          <EmCasaButton disabled={loading} full type="submit">
            {loading ? 'Aguarde...' : 'Enviar'}
          </EmCasaButton>
          <Errors errors={errors} />
        </Form>
      </Fragment>
    )
  }
}
