function Login() {
  return (
    <main className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-6 py-12 md:grid-cols-2">
      {/* Регистрация */}
      <section className="rounded-xl border border-gray-200 p-6">
        <h1 className="mb-2 text-2xl font-bold">Регистрация</h1>
        <p className="mb-6 text-sm text-gray-500">Создай аккаунт Waroji</p>

        <form className="space-y-4">
          <div>
            <label htmlFor="register-username" className="mb-1 block text-sm">
              Username
            </label>
            <input
              id="register-username"
              name="username"
              type="text"
              autoComplete="username"
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="register-email" className="mb-1 block text-sm">
              Email
            </label>
            <input
              id="register-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="register-password" className="mb-1 block text-sm">
              Пароль
            </label>
            <input
              id="register-password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Зарегистрироваться
          </button>
        </form>
      </section>

      {/* Вход */}
      <section className="rounded-xl border border-gray-200 p-6">
        <h2 className="mb-2 text-2xl font-bold">Вход</h2>
        <p className="mb-6 text-sm text-gray-500">Рад снова тебя видеть</p>

        <form className="space-y-4">
          <div>
            <label htmlFor="login-identifier" className="mb-1 block text-sm">
              Username или Email
            </label>
            <input
              id="login-identifier"
              name="login"
              type="text"
              autoComplete="username"
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="login-password" className="mb-1 block text-sm">
              Пароль
            </label>
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Войти
          </button>
        </form>
      </section>
    </main>
  );
}

export default Login;
