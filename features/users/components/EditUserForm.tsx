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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { type EditUserFormValues, editUserSchema } from '../utils/schema';
import type { User as UserType } from '../types';
import {
  dialogMutedPanelClass,
  dialogPanelClass,
  fieldInputClass,
  formFooterClass,
  formLabelClass,
  primaryButtonClass,
  secondaryButtonClass,
  selectTriggerClass,
} from './user-dialog-styles';

interface EditUserFormProps {
  user: UserType;
  onSubmit: (data: EditUserFormValues) => void;
  onCancel: () => void;
  isPending: boolean;
}

export function EditUserForm({
  user,
  onSubmit,
  onCancel,
  isPending,
}: EditUserFormProps) {
  const form = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      role: user.role,
      apiKey: user.apiKey,
      status: user.status,
      billingRate: user.billingRate,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className={dialogPanelClass}>
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-950 dark:text-white">
              User profile
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Keep identity and Retell access details current.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={formLabelClass}>Full name</FormLabel>
                  <FormControl>
                    <Input
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
                  <FormLabel className={formLabelClass}>
                    Email address
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
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

          <FormField
            control={form.control}
            name="apiKey"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel className={formLabelClass}>API key</FormLabel>
                <FormControl>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
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
        </div>

        <div className={dialogPanelClass}>
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-950 dark:text-white">
              Access and billing
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Control permissions, billing rate, and account availability.
            </p>
          </div>

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
                  <FormLabel className={formLabelClass}>Billing rate</FormLabel>
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

        <div className={dialogMutedPanelClass}>
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className={formLabelClass}>Account status</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="grid gap-2 sm:grid-cols-3"
                  >
                    <div className="flex items-center space-x-2 rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-white/10 dark:bg-[#18202f]">
                      <RadioGroupItem value="active" id="active" />
                      <FormLabel
                        htmlFor="active"
                        className="cursor-pointer font-normal text-slate-700 dark:text-slate-200"
                      >
                        Active
                      </FormLabel>
                    </div>
                    <div className="flex items-center space-x-2 rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-white/10 dark:bg-[#18202f]">
                      <RadioGroupItem value="pending" id="pending" />
                      <FormLabel
                        htmlFor="pending"
                        className="cursor-pointer font-normal text-slate-700 dark:text-slate-200"
                      >
                        Pending
                      </FormLabel>
                    </div>
                    <div className="flex items-center space-x-2 rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-white/10 dark:bg-[#18202f]">
                      <RadioGroupItem value="suspended" id="suspended" />
                      <FormLabel
                        htmlFor="suspended"
                        className="cursor-pointer font-normal text-slate-700 dark:text-slate-200"
                      >
                        Suspended
                      </FormLabel>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
              'Save Changes'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
