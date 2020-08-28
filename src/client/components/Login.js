import React from "react";
import {Formik, Field, Form} from "formik";

export default function Login() {
  return (
    <div>
      <h1>Login</h1>
      <Formik
        initialValues={{username: "username", password: "password"}}
        onSubmit={() => {}}>
        <Form>
          <Field
            className="fieldMuted"
            id="username"
            name="username"
            placeholder="Username"
          />
          <Field id="password" name="password" placeholder="password" />
          <button type="submit">Submit</button>
        </Form>
      </Formik>
    </div>
  );
}
