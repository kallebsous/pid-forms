import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';

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
        const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
        if (!phoneRegex.test(value)) {
          newErrors.phone = 'Formato inválido. Use (99) 99999-9999';
        } else {
          delete newErrors.phone;
        }
        break;
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
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-300">
            Nome Completo
          </label>
          <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm bg-gray-700 border-gray-600 text-gray-100 ${
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
          <label htmlFor="phone" className="block text-sm font-medium text-gray-300">
            Telefone
          </label>
          <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="(99) 99999-9999"
              className={`mt-1 block w-full rounded-md shadow-sm bg-gray-700 border-gray-600 text-gray-100 ${
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
          <button
              type="submit"
              disabled={isSubmitting || Object.keys(errors).length > 0}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
                'Enviando...'
            ) : (
                <>
                  <UserPlus className="w-5 h-5 mr-2" />
                  Realizar Inscrição
                </>
            )}
          </button>

          <button
              type="button"
              onClick={handleAdminLoginRedirect}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            <Lock className="w-5 h-5 mr-2" />
            Login Administrativo
          </button>
        </div>
      </form>
  );
}