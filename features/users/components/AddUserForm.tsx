'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { KeyRound, Loader2, Mail, Shield, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { AddUserFormValues, addUserSchema } from '../utils/schema';
import RequiredFormLabel from '@/components/ui/required-form-label';
import {
  fieldInputClass,
  formFooterClass,
  formLabelClass,
  primaryButtonClass,
  secondaryButtonClass,
  selectTriggerClass,
} from './user-dialog-styles';

interface AddUserFormProps {
  onSubmit: (data: AddUserFormValues) => void;
  onCancel: () => void;
  isPending: boolean;
}

export function AddUserForm({
  onSubmit,
  onCancel,
  isPending,
}: AddUserFormProps) {
  const form = useForm<AddUserFormValues>({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'standard',
      billingRate: 0.5,
      sendInvite: true,
      apiKey: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-950 dark:text-white">
              User profile
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Basic identity and workspace permissions.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <RequiredFormLabel className={formLabelClass}>
                    Full name
                  </RequiredFormLabel>
                  <FormControl>
                    <Input
                      required
                      placeholder="John Doe"
                      className={fieldInputClass}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <RequiredFormLabel className={formLabelClass}>
                    Email address
                  </RequiredFormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-400" />
                      <Input
                        required
                        type="email"
                        placeholder="john@example.com"
                        className={`${fieldInputClass} pl-9`}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="border-t border-slate-200/80 pt-5 dark:border-white/10">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-950 dark:text-white">
              Access and billing
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Configure Retell access and how this user is charged.
            </p>
          </div>

          <div className="grid gap-4">
            <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem>
                  <RequiredFormLabel className={formLabelClass}>
                    API key
                  </RequiredFormLabel>
                  <FormControl>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-300" />
                      <Input
                        required
                        placeholder="Paste API key here"
                        className={`${fieldInputClass} pl-9`}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={formLabelClass}>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className={selectTriggerClass}>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            <span>Admin</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="standard">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>Standard User</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="billingRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={formLabelClass}>
                      Billing rate
                    </FormLabel>
                    <Select
                      onValueChange={value =>
                        field.onChange(Number.parseFloat(value))
                      }
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger className={selectTriggerClass}>
                          <SelectValue placeholder="Select a billing rate" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0.5">Basic (€0.50/min)</SelectItem>
                        <SelectItem value="0.75">
                          Discounted (€0.40/min)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <FormField
          control={form.control}
          name="sendInvite"
          render={({ field }) => (
            <FormItem
              className={`flex flex-row items-start space-x-3 space-y-0 border-t border-slate-200/80 pt-5 dark:border-white/10`}
            >
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  Send invitation email
                </FormLabel>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  The user receives a secure link to set their password.
                </p>
              </div>
            </FormItem>
          )}
        />

        <div className={formFooterClass}>
          <Button
            variant="outline"
            type="button"
            onClick={onCancel}
            className={secondaryButtonClass}
          >
            Cancel
          </Button>

          <Button
            disabled={isPending || !form.formState.isDirty}
            className={primaryButtonClass}
            type="submit"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Please Wait
              </>
            ) : (
              'Add User'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
