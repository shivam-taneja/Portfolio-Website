"use client";

import React, { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { toast } from "react-toastify";

import useRecaptcha from "@/hooks/use-recaptcha";

import { sendEmail } from "@/app/actions/send-mail";

import { analyticsEvents, captureEvent } from "@/lib/analytics";
import type { ContactPreset } from "@/lib/constants/contact-presets";
import { cn } from "@/lib/utils";

import { contactFormSchema, ContactFormSchema } from "@/schema/contact";

import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

type ContactFormProps = {
  source?: string;
  preset?: ContactPreset;
};

const prefilledFieldClass =
  "border-emerald-400/70 bg-emerald-50 dark:border-emerald-500/50 dark:bg-emerald-950/40";

const ContactForm = ({ source, preset }: ContactFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const { executeRecaptcha } = useRecaptcha();

  const defaultValues: ContactFormSchema = {
    email: "",
    name: "",
    subject: preset?.subject ?? "",
    message: preset?.message ?? "",
  };

  const form = useForm<ContactFormSchema>({
    resolver: zodResolver(contactFormSchema),
    defaultValues,
    mode: "all",
  });

  const { dirtyFields } = form.formState;
  const subjectIsPrefilled = !!preset && !dirtyFields.subject;
  const messageIsPrefilled = !!preset && !dirtyFields.message;

  const analyticsProps = source ? { source } : undefined;

  useEffect(() => {
    if (!preset) return;

    toast.info(`Prefilled from ${preset.label} — add your details or edit as you like.`, {
      toastId: `contact-prefill-${source ?? "preset"}`,
      autoClose: 5000,
    });
  }, [preset, source]);

  async function onSubmit(values: ContactFormSchema) {
    setIsSubmitting(true);

    try {
      // Execute reCAPTCHA and get token
      const recaptchaToken = await executeRecaptcha();

      // Send the form data with the reCAPTCHA token
      await toast
        .promise(
          sendEmail({
            ...values,
            recaptchaToken,
          }).then((result) => {
            captureEvent(analyticsEvents.contactFormSubmitted, {
              subject_length: values.subject.length,
              message_length: values.message.length,
              ...analyticsProps,
            });

            return result;
          }),
          {
            pending: "Sending Message...",
            success: {
              render() {
                setTimeout(() => {
                  form.reset(defaultValues);

                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }, 0);

                return "Message sent successfully!";
              },
            },
            error: {
              render({ data }: { data: Error }) {
                captureEvent(analyticsEvents.contactFormFailed, {
                  reason: data.message || "unknown",
                  ...analyticsProps,
                });

                const errMsg =
                  data.message || "Failed to send message. Please try again.";
                return errMsg;
              },
            },
          },
        )
        // Suppress error propagation since it's being handled in UI.
        .catch(() => {});
    } catch (error) {
      console.error("Error submitting form:", error);
      captureEvent(analyticsEvents.contactFormFailed, {
        reason: error instanceof Error ? error.message : "unknown",
        ...analyticsProps,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleFormInteraction() {
    if (hasStarted) return;

    setHasStarted(true);
    captureEvent(analyticsEvents.contactFormStarted, analyticsProps);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        onFocusCapture={handleFormInteraction}
        className="space-y-6 w-full"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="dark:text-white text-zinc-900">
                Full Name *
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="John Doe"
                  {...field}
                  disabled={isSubmitting}
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
              <FormLabel className="dark:text-white text-zinc-900">
                Email *
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="john@example.com"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="dark:text-white text-zinc-900">
                Subject *
                {subjectIsPrefilled && (
                  <span className="ml-2 text-xs font-normal text-emerald-700 dark:text-emerald-400">
                    prefilled
                  </span>
                )}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Project Discussion"
                  {...field}
                  disabled={isSubmitting}
                  className={cn(subjectIsPrefilled && prefilledFieldClass)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="dark:text-white text-zinc-900">
                Message *
                {messageIsPrefilled && (
                  <span className="ml-2 text-xs font-normal text-emerald-700 dark:text-emerald-400">
                    prefilled
                  </span>
                )}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell me more about your project..."
                  className={cn(
                    "min-h-[150px]",
                    messageIsPrefilled && prefilledFieldClass,
                  )}
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="w-full dark:bg-zinc-800 bg-zinc-900 border-none outline-none md:px-4 px-2 text-white dark:hover:bg-zinc-700 hover:bg-zinc-800"
          variant="outline"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" aria-hidden="true" />
              Submitting...
            </>
          ) : (
            "Send message"
          )}
        </Button>

        <div className="text-xs dark:text-white/50 text-zinc-500">
          This site is protected by reCAPTCHA and the Google{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="underline dark:hover:text-white/70 hover:text-zinc-700"
          >
            Privacy Policy
          </a>{" "}
          and{" "}
          <a
            href="https://policies.google.com/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="underline dark:hover:text-white/70 hover:text-zinc-700"
          >
            Terms of Service
          </a>{" "}
          apply.
        </div>
      </form>
    </Form>
  );
};

export default ContactForm;
