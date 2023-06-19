import LoginForm from "./components/login_form"
import Image from "next/image"

export default function LoginPage() {
    return (
        <div className="flex justify-between">
            <div className="flex justify-center w-1/2 ">
                <img
                    className="max-w-4xl p-4"
                    src="/login/login.svg"
                    alt="Login"
                />
            </div>
            <div
                className="w-1/2 ">
                <LoginForm />
            </div>
        </div>
    )
}