import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { API_URL } from '../../config';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Invalid credentials');
            }

            const data = await response.json();
            login(data.access_token, data.user);
            navigate('/');
        } catch (err) {
            setError('Invalid email or password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div id="login-page" className="min-h-screen flex items-center justify-center bg-background p-4">
            <div id="login-card" className="w-full max-w-md space-y-8 bg-card p-8 rounded-2xl border border-border shadow-2xl">
                <div id="login-header" className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
                        <Lock size={24} />
                    </div>
                    <h2 id="login-title" className="text-3xl font-bold tracking-tight text-foreground">Welcome back</h2>
                    <p id="login-subtitle" className="text-muted-foreground">Sign in to access your analytics dashboard</p>
                </div>

                <form id="login-form" className="space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div id="login-error" className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label id="label-email" className="text-sm font-medium text-foreground">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                <input
                                    id="input-email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-secondary/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground/50"
                                    placeholder="name@company.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label id="label-password" className="text-sm font-medium text-foreground">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                <input
                                    id="input-password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-secondary/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground/50"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        id="btn-login-submit"
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <div id="login-loader" className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                Sign in
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};
