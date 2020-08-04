import React from 'react'
import {Formik, Field, Form} from 'formik'

class Login extends React.Component {
  render() {
    return <div>
      <h1>Login</h1>
      <Formik
        initialValues={{username: "username", password: "password"}}
        onSubmit={(values) => this.props.handleLogin(values)}
      >
        <Form>
          <Field id="username" name="username" placeholder="Username"/>
          <Field id="password" name="password" placeholder="password"/>
          <button type="submit">Submit</button>
        </Form>
      </Formik>
    </div>
  }
}

export default Login