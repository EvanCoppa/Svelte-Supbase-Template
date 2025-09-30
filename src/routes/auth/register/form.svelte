<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import * as Form from "$lib/components/ui/form/index.js";
  import PasswordInput from "$lib/components/ui/password-input.svelte";
  import { formSchema, type FormSchema } from "./schema";
  import { type SuperValidated, type Infer, superForm } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { toastStore } from "$lib/toast";
  import { supabase } from "$lib/supabase";
  import { Button } from "$lib/components/ui/button/index.js";

  let { data }: { data: { form: SuperValidated<Infer<FormSchema>> } } = $props();

  async function handleGoogleSignIn() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) {
      toastStore.error(`Google sign-in failed: ${error.message}`);
    }
  }

  const form = superForm(data.form, {
    validators: zodClient(formSchema),
    validationMethod: 'submit-only',
    clearOnSubmit: 'errors-and-message',
    onResult: ({ result }) => {
      if (result.type === 'success') {
        toastStore.success('Registration successful! Welcome.');
      } else if (result.type === 'failure') {
        const error = result.data?.error;
        if (error?.message) {
          toastStore.error(`Registration failed: ${error.message}`);
        } else {
          toastStore.error('Registration failed. Please try again.');
        }
      }
    },
    onError: () => {
      toastStore.error('An unexpected error occurred. Please try again.');
    }
  });

  const { form: formData, enhance } = form;
</script>

<Card.Root class="m-auto w-full max-w-sm">
  <Card.Header>
    <Card.Title class="text-2xl">Register</Card.Title>
    <Card.Description>Create a new account to get started</Card.Description>
  </Card.Header>
  <Card.Content>
    <form method="POST" action="?/register" use:enhance class="max-w-2xl flex flex-col m-auto gap-5">
      <Form.Field {form} name="email">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Email</Form.Label>
            <Input {...props} bind:value={$formData.email} type="email" />
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field {form} name="password">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Password</Form.Label>
            <PasswordInput {...props} bind:value={$formData.password} />
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field {form} name="confirmPassword">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Confirm Password</Form.Label>
            <PasswordInput {...props} bind:value={$formData.confirmPassword} />
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>

      <Form.Button>Create Account</Form.Button>
    </form>

    <div class="relative my-4">
      <div class="absolute inset-0 flex items-center">
        <span class="w-full border-t"></span>
      </div>
      <div class="relative flex justify-center text-xs uppercase">
        <span class="bg-white px-2 text-gray-500">Or continue with</span>
      </div>
    </div>

    <Button
      type="button"
      variant="outline"
      class="w-full"
      onclick={handleGoogleSignIn}
    >
      <svg class="mr-2 h-4 w-4" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="currentColor"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="currentColor"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="currentColor"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      Sign up with Google
    </Button>

    <div class="mt-4 text-center text-sm">
      Already have an account?{" "}
      <a href="/login" class="text-blue-600 hover:text-blue-500 font-medium underline underline-offset-4">
        Sign in here
      </a>
    </div>
  </Card.Content>
</Card.Root>