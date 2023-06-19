import RegisterForm from "./components/register_form"

export default function RegisterPage() {
    return (
        <div className="flex">
            <div className="flex w-1/2 justify-center">
                <img
                    className="max-w-4xl p-4"
                    src="/register/register.svg"
                    alt="Register"
                />
            </div>
            <div
                className="w-1/2">
                <RegisterForm />
            </div>
        </div>
    )
}