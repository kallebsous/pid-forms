import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { SuccessToast } from './SucessToast.tsx';

interface FormData {
  fullName: string;
  phone: string;
}

interface FormErrors {
  fullName?: string;
  phone?: string;
}

export function RegistrationForm() {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phone: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const validateField = (name: keyof FormData, value: string) => {
    const newErrors: FormErrors = { ...errors };

    switch (name) {
      case 'fullName':
        if (value.length < 3) {
          newErrors.fullName = 'Nome deve ter pelo menos 3 caracteres';
        } else {
          delete newErrors.fullName;
        }
        break;
      case 'phone':
        { const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
        if (!phoneRegex.test(value)) {
          newErrors.phone = 'Insira um número de telefone válido';
        } else {
          delete newErrors.phone;
        }
        break; }
    }

    setErrors(newErrors);
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})?(\d{5})?(\d{4})?/, (_, ddd, prefix, suffix) => {
        let formatted = '';
        if (ddd) formatted += `(${ddd}`;
        if (prefix) formatted += `) ${prefix}`;
        if (suffix) formatted += `-${suffix}`;
        return formatted;
      });
    }
    return value;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const formattedValue = name === 'phone' ? formatPhone(value) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));

    validateField(name as keyof FormData, formattedValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
          .from('inscricoes')
          .insert([
            {
              nome: formData.fullName,
              telefone: formData.phone,
            },
          ])
          .select();

      if (error) {
        console.error('Supabase error:', error.message);
        throw new Error(error.message);
      }

      toast.success('Inscrição realizada com sucesso!');
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        localStorage.setItem('inscrito', 'true');
        navigate('/grupo');
      }, 3000);
      setFormData({ fullName: '', phone: '' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      console.error('Registration error:', errorMessage);
      toast.error(`Erro ao realizar inscrição: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }

  };

  const handleAdminLoginRedirect = () => {
    navigate('/admin/login');
  };

  return (
      <motion.form
          onSubmit={handleSubmit}
          className="space-y-6"
          noValidate
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
      >
        <SuccessToast show={showSuccess} message="Inscrição realizada com sucesso!" />

        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-black dark:text-white">
            Nome Completo
          </label>
          <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder= "  Insira seu Nome Completo"
              className={`appearance-none mt-1 relative block w-full border border-gray-700 placeholder-gray-500 text-black dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm bg-gray-300 dark:bg-blue-300 px-3 py-2 rounded-full shadow-sm ${
                  errors.fullName
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'focus:border-blue-500 focus:ring-blue-500'
              }`}
              required
              aria-describedby={errors.fullName ? 'fullName-error' : undefined}
          />
          {errors.fullName && (
              <p className="mt-2 text-sm text-red-400" id="fullName-error">
                {errors.fullName}
              </p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-black dark:text-white">
            Telefone
          </label>
          <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="  (99) 99999-9999"
              className={`appearance-none mt-1 relative block w-full border border-gray-700 placeholder-gray-500 text-black dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm bg-gray-300 dark:bg-blue-300 px-3 py-2 rounded-full shadow-sm ${
                  errors.phone
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'focus:border-blue-500 focus:ring-blue-500'
              }`}
              required
              aria-describedby={errors.phone ? 'phone-error' : undefined}
          />
          {errors.phone && (
              <p className="mt-2 text-sm text-red-400" id="phone-error">
                {errors.phone}
              </p>
          )}
        </div>

        <div className="space-y-4">
          <motion.button
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting || Object.keys(errors).length > 0}
              className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isSubmitting ? 'Enviando...' : <>
              <UserPlus className="w-5 h-5" />
              Realizar Inscrição
            </>}
          </motion.button>

          <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAdminLoginRedirect}
              className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-black dark:text-white bg-gradient-to-bl hover:bg-rose-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
          >
            <Lock className="w-5 h-5" />
            Login Administrativo
          </motion.button>
        </div>
      </motion.form>
  );
}
