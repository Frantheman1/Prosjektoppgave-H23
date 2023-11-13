import React, { Component, ChangeEvent, FormEvent } from 'react';

interface RegisterState {
  username: string;
  password: string;
  email: string;
}

class Register extends Component<{}, RegisterState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            username: '',
            password: '',
            email: '',
        };
    }

    handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        this.setState({ [name]: value } as Pick<RegisterState, keyof RegisterState>);
    }

    handleRegister = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { email, username, password } = this.state;

        // Send a POST request to your registration route on the server
        fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, username, password }),
        })
        .then((response) => {
            if (response.ok) {
                // Registration was successful, handle it accordingly
                console.log('Registration successful');
            } else {
                // Handle registration failure (e.g., username already exists)
                console.error('Registration failed');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    render() {
        return (
            <div>
                <h1>Register</h1>
                <form onSubmit={this.handleRegister}>
                <div>
                        <label htmlFor="email">Email:</label>
                        <input
                            type="text"
                            name="email"
                            onChange={this.handleInputChange}
                            value={this.state.email}
                        />
                    </div>
                    <div>
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            name="username"
                            onChange={this.handleInputChange}
                            value={this.state.username}
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            name="password"
                            onChange={this.handleInputChange}
                            value={this.state.password}
                        />
                    </div>
                    <div>
                        <button type="submit">Submit</button>
                    </div>
                </form>
            </div>
        );
    }
}

export default Register;