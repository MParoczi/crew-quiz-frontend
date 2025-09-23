import { Anchor, BackgroundImage, Box, Button, Flex, Group, LoadingOverlay, Paper, PasswordInput, Stack, Text, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import md5 from "md5";
import { memo, useCallback, useEffect } from "react";
import { useNavigate } from "react-router";

import { postApiAuthenticationLoginMutation } from "../../api/@tanstack/react-query.gen";
import { home, registration } from "../../constants/pages";
import useMutateData from "../../hooks/useMutateData";
import useUserLocalStorage from "../../hooks/useUserLocalStorage";
import backgroundImage from "../../resources/images/login_background.jpg";
import { setApiToken } from "../../utils/apiClient";

import styles from "./loginPage.module.css";
import { useAtom } from "jotai";
import { userAuthenticatedConfig } from "../../storage_configs/authenticationConfigs.ts";

interface ILoginForm {
  username: string;
  password: string;
}

function LoginPage() {
  const [, setUserLocalStorage] = useUserLocalStorage();
  const navigate = useNavigate();
  const [loginLoadingOverlayVisible, { toggle: toggleLoginLoadingOverlay }] = useDisclosure(false);
  const [authenticationDto, loginUser] = useMutateData(postApiAuthenticationLoginMutation, { onError: toggleLoginLoadingOverlay });
  const [, setIsUserAuthenticated] = useAtom<boolean>(userAuthenticatedConfig);
  const form = useForm<ILoginForm>({
    mode: "controlled",
    initialValues: {
      username: "",
      password: "",
    },
    validate: {
      password(value) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value)
          ? null
          : "Password must contain uppercase letter, number, special character and must be at lest 8 character long";
      },
    },
  });

  const handleSubmit = useCallback(
    async (form: ILoginForm) => {
      toggleLoginLoadingOverlay();
      await loginUser({
        username: form.username,
        passwordMd5: md5(form.password),
      });
    },
    [loginUser, toggleLoginLoadingOverlay],
  );

  const redirectToRegisterPage = useCallback(() => {
    void navigate(registration);
  }, [navigate]);

  useEffect(() => {
    if (authenticationDto?.token) {
      setUserLocalStorage(authenticationDto);
      setApiToken(authenticationDto.token);
      setIsUserAuthenticated(true);
      void navigate(home);
    }
  }, [authenticationDto, navigate, setIsUserAuthenticated, setUserLocalStorage]);

  function renderWelcomeText() {
    return (
      <Title order={2} ta="left" c="white" mb={{ base: 30, sm: 50 }} fw={500}>
        Welcome back to Crew Quiz!
      </Title>
    );
  }

  function renderLoginForm() {
    return (
      <Box pos="relative">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <LoadingOverlay visible={loginLoadingOverlayVisible} loaderProps={{ type: "bars" }} zIndex={1000} />
          <TextInput
            required
            placeholder="Username"
            variant="filled"
            classNames={{
              input: styles.textInput,
            }}
            size="md"
            radius="xs"
            key={form.key("username")}
            {...form.getInputProps("username")}
          />
          <PasswordInput
            required
            placeholder="Password"
            variant="filled"
            classNames={{
              input: styles.textInput,
              visibilityToggle: styles.passwordVisibilityToggle,
            }}
            radius="xs"
            mt="md"
            size="md"
            key={form.key("password")}
            {...form.getInputProps("password")}
          />
          <Button
            type="submit"
            fullWidth
            color="greenAccent"
            variant="light"
            radius="xs"
            mt={{ base: "xl", sm: "xl" }}
            size="md"
            classNames={{
              root: styles.loginButton,
            }}
          >
            Login
          </Button>
        </form>
      </Box>
    );
  }

  function renderRegister() {
    return (
      <Group justify="center">
        <Text c="gray.5" ta="center" mt="md">
          {"Don't have an account? "}
          <Anchor fw={600} onClick={redirectToRegisterPage} c="greenAccent" underline="never">
            Register
          </Anchor>
        </Text>
      </Group>
    );
  }

  function render() {
    return (
      <BackgroundImage src={backgroundImage} h="100vh" className={styles.backgroundImage}>
        <Box h="100%">
          <Flex align="center" h="100%">
            <Paper w={{ base: "100%", sm: 450 }} h={{ base: "100vh", sm: "100%" }} p={{ base: 30, sm: 30 }} pt={{ base: 30, sm: 30 }} radius={0} bg="rgba(20, 21, 23, 0.9)">
              <Stack gap="xl" justify="center" h="100%" px={{ base: 10, sm: 20 }}>
                {renderWelcomeText()}
                {renderLoginForm()}
                {renderRegister()}
              </Stack>
            </Paper>
          </Flex>
        </Box>
      </BackgroundImage>
    );
  }

  return render();
}

export default memo(LoginPage);
