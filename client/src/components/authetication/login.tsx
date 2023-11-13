import React, { Component, ChangeEvent, FormEvent } from 'react';

interface LoginState {
  username: string;
  password: string;
}

class Login extends Component<{}, LoginState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            username: '',
            password: '',
        };
    }
    
    handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        this.setState({ [name]: value } as Pick<LoginState, keyof LoginState>);
    }

    handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
        const { username, password } = this.state;

        fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        })
        .then((response) => {
            if (response.ok) {
                console.log('Login successful');
            } else {
                console.error('Login failed');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    render() {
        return (
            <div>
                <h1>Login</h1>
                <form onSubmit={this.handleLogin}>
                    <div>
                        <label htmlFor="username">Username:</label>
                        <input type="text" id="username" name="username" onChange={this.handleInputChange} value={this.state.username} />
                    </div>
                    <div>
                        <label htmlFor="password">Password:</label>
                        <input type="password" id="password" name="password" onChange={this.handleInputChange} value={this.state.password} />
                    </div>
                    <div>
                        <button type="submit">Submit</button>
                    </div>
                </form>
            </div>
        );
    }
}

export default Login;