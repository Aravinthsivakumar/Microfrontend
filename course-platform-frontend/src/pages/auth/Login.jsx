import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { authAPI } from "../../api/services";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await authAPI.login(form);
      login(data);
      if (data.roles?.includes("ROLE_ADMIN")) navigate("/admin/dashboard");
      else if (data.roles?.includes("ROLE_TRAINER"))
        navigate("/trainer/dashboard");
      else navigate("/user/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid credentials. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-logo">
          <i className="bi bi-mortarboard-fill" />
        </div>
        <h4 className="text-center fw-bold mb-1">Welcome Back</h4>
        <p
          className="text-center text-muted mb-4"
          style={{ fontSize: "0.88rem" }}
        >
          Sign in to your account
        </p>

        {error && (
          <div className="alert alert-danger d-flex align-items-center gap-2">
            <i className="bi bi-exclamation-triangle" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label
              className="form-label fw-semibold"
              style={{ fontSize: "0.88rem" }}
            >
              Email Address
            </label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-envelope text-muted" />
              </span>
              <input
                type="email"
                name="email"
                className="form-control border-start-0"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label
              className="form-label fw-semibold"
              style={{ fontSize: "0.88rem" }}
            >
              Password
            </label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-lock text-muted" />
              </span>
              <input
                type="password"
                name="password"
                className="form-control border-start-0"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary-custom w-100"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="text-center mt-4 mb-0" style={{ fontSize: "0.88rem" }}>
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="text-decoration-none fw-semibold"
            style={{ color: "#4f46e5" }}
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
