import { Anchor, Box, Button, Container, LoadingOverlay, Paper, PasswordInput, Text, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import md5 from "md5";
import { memo, useCallback } from "react";
import { useNavigate } from "react-router";

import { postApiUserCreateUserMutation } from "../../api/@tanstack/react-query.gen";
import { login } from "../../constants/pages";
import useMutateData from "../../hooks/useMutateData";

interface IRegistrationForm {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
}

function RegistrationPage() {
  const navigate = useNavigate();

  const handleRegistrationSuccess = useCallback(() => {
    void navigate(login);
  }, [navigate]);

  const [, registerUser, isUserRegistrationLoading] = useMutateData(postApiUserCreateUserMutation, {
    onSuccess: handleRegistrationSuccess,
    successMessage: "Registration was successful",
  });
  const form = useForm<IRegistrationForm>({
    mode: "controlled",
    initialValues: {
      firstName: "",
      lastName: "",
      username: "",
      password: "",
    },
    validate: {
      password(value: string) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value)
          ? null
          : "Password must contain uppercase letter, number, special character and must be at lest 8 character long";
      },
    },
  });

  const handleSubmit = useCallback(
    async (form: IRegistrationForm) => {
      await registerUser({
        firstName: form.firstName,
        lastName: form.lastName,
        username: form.username,
        passwordMd5: md5(form.password),
      });
    },
    [registerUser],
  );

  const redirectToLoginPage = useCallback(() => {
    void navigate(login);
  }, [navigate]);

  function renderLoginLink() {
    return (
      <Text c="dimmed" ta="center" mt={5}>
        {"Already have an account? "}
        <Anchor fw={700} onClick={redirectToLoginPage}>
          Sign in
        </Anchor>
      </Text>
    );
  }

  function renderInputFields() {
    return (
      <Box pos="relative">
        <LoadingOverlay visible={isUserRegistrationLoading} zIndex={1000} overlayProps={{ radius: "xs", blur: 2 }} />
        <TextInput placeholder="First Name" variant="filled" size="md" radius="xs" required key={form.key("firstName")} {...form.getInputProps("firstName")} />
        <TextInput placeholder="Last Name" variant="filled" size="md" radius="xs" required mt="md" key={form.key("lastName")} {...form.getInputProps("lastName")} />
        <TextInput placeholder="Username" variant="filled" size="md" radius="xs" required mt="md" key={form.key("username")} {...form.getInputProps("username")} />
        <PasswordInput placeholder="Password" variant="filled" size="md" radius="xs" required mt="md" key={form.key("password")} {...form.getInputProps("password")} />
      </Box>
    );
  }

  function renderRegistrationForm() {
    return (
      <Paper shadow="sm" radius="xs" withBorder p="xl" mt={30}>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          {renderInputFields()}
          <Button type="submit" fullWidth variant="light" radius="xs" mt="xl" size="md" disabled={isUserRegistrationLoading}>
            Create account
          </Button>
        </form>
      </Paper>
    );
  }

  function render() {
    return (
      <Container size={420} my={40}>
        <Title ta="center" fw={900}>
          Create your Crew Quiz account
        </Title>
        {renderLoginLink()}
        {renderRegistrationForm()}
      </Container>
    );
  }

  return render();
}

export default memo(RegistrationPage);
