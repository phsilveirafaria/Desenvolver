import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { Building, AlertCircle, UserPlus } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const signupSchema = loginSchema.extend({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  confirmPassword: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
}).refine(data => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

const LoginPage: React.FC = () => {
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSignup, setIsSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { 
    register: registerLogin, 
    handleSubmit: handleLoginSubmit, 
    formState: { errors: loginErrors, isSubmitting: isLoginSubmitting } 
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  
  const { 
    register: registerSignup, 
    handleSubmit: handleSignupSubmit, 
    formState: { errors: signupErrors, isSubmitting: isSignupSubmitting } 
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });
  
  const onLoginSubmit = async (data: LoginFormData) => {
    setLoginError(null);
    setIsLoading(true);
    try {
      const success = await login(data.email, data.password);
      if (success) {
        navigate('/');
      } else {
        setLoginError('Email ou senha inválidos');
      }
    } catch (error) {
      setLoginError('Ocorreu um erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };
  
  const onSignupSubmit = async (data: SignupFormData) => {
    setLoginError(null);
    setIsLoading(true);
    try {
      const success = await signup(data.email, data.password, data.name);
      if (success) {
        // Show success message before redirecting
        setLoginError('Conta criada com sucesso! Redirecionando...');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setLoginError('Erro ao criar conta. Tente novamente.');
      }
    } catch (error) {
      setLoginError('Ocorreu um erro ao criar conta');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center bg-blue-100 p-3 rounded-full mb-4">
              <Building className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold">
              {isSignup ? 'Criar Conta' : 'Entrar no Desenvolver'}
            </h1>
            <p className="text-gray-600 mt-1">
              {isSignup 
                ? 'Crie sua conta para agendar salas' 
                : 'Acesse sua conta para gerenciar reservas'}
            </p>
          </div>
          
          {loginError && (
            <div className={`mb-4 p-3 ${loginError.includes('sucesso') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} rounded-md flex items-center`}>
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>{loginError}</span>
            </div>
          )}
          
          {isSignup ? (
            <form onSubmit={handleSignupSubmit(onSignupSubmit)}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 mb-1">
                  Nome
                </label>
                <input
                  id="name"
                  type="text"
                  {...registerSignup('name')}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    signupErrors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Seu nome completo"
                />
                {signupErrors.name && (
                  <p className="text-red-500 text-sm mt-1">{signupErrors.name.message}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="signup-email" className="block text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="signup-email"
                  type="email"
                  {...registerSignup('email')}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    signupErrors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="seu@email.com"
                />
                {signupErrors.email && (
                  <p className="text-red-500 text-sm mt-1">{signupErrors.email.message}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="signup-password" className="block text-gray-700 mb-1">
                  Senha
                </label>
                <input
                  id="signup-password"
                  type="password"
                  {...registerSignup('password')}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    signupErrors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                />
                {signupErrors.password && (
                  <p className="text-red-500 text-sm mt-1">{signupErrors.password.message}</p>
                )}
              </div>
              
              <div className="mb-6">
                <label htmlFor="confirmPassword" className="block text-gray-700 mb-1">
                  Confirmar Senha
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  {...registerSignup('confirmPassword')}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    signupErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                />
                {signupErrors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{signupErrors.confirmPassword.message}</p>
                )}
              </div>
              
              <button
                type="submit"
                disabled={isSignupSubmitting || isLoading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center"
              >
                <UserPlus className="h-5 w-5 mr-2" />
                {isSignupSubmitting || isLoading ? 'Criando conta...' : 'Criar Conta'}
              </button>
              
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => setIsSignup(false)}
                  className="text-blue-600 hover:underline"
                >
                  Já tem uma conta? Faça login
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleLoginSubmit(onLoginSubmit)}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  {...registerLogin('email')}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    loginErrors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="seu@email.com"
                />
                {loginErrors.email && (
                  <p className="text-red-500 text-sm mt-1">{loginErrors.email.message}</p>
                )}
              </div>
              
              <div className="mb-6">
                <label htmlFor="password" className="block text-gray-700 mb-1">
                  Senha
                </label>
                <input
                  id="password"
                  type="password"
                  {...registerLogin('password')}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    loginErrors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                />
                {loginErrors.password && (
                  <p className="text-red-500 text-sm mt-1">{loginErrors.password.message}</p>
                )}
              </div>
              
              <button
                type="submit"
                disabled={isLoginSubmitting || isLoading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isLoginSubmitting || isLoading ? 'Entrando...' : 'Entrar'}
              </button>
              
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => setIsSignup(true)}
                  className="text-blue-600 hover:underline"
                >
                  Não tem uma conta? Cadastre-se
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;