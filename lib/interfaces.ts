export interface respType {
    status: boolean,
    message: string,
    data?: Array<any>
}
export interface registerUser {
    name: string,
    email: string,
    password: string,
    c_password: string
}