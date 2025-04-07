export default class User {
    constructor(props: { email: string; username: string }) {
        this.email = props.email;
        this.username = props.username;
    }

    public email: string;
    public username: string;
}
