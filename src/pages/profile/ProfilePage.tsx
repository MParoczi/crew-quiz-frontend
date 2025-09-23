import { Box, Button, Container, Group, LoadingOverlay, Paper, Stack, Text, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconEdit, IconTrash, IconUser } from "@tabler/icons-react";
import { memo, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { deleteApiUserDeleteUserByUserIdMutation, getApiUserGetCurrentUserOptions, putApiUserUpdateUserMutation } from "../../api/@tanstack/react-query.gen";
import ConfirmationModal from "../../components/confirmation_modal/ConfirmationModal";
import LoadingContainer from "../../components/loading_container/LoadingContainer";
import { login } from "../../constants/pages";
import useMutateData from "../../hooks/useMutateData";
import useQueryData from "../../hooks/useQueryData";
import useUserLocalStorage from "../../hooks/useUserLocalStorage";

import type { BackendModelsDtosUserDto } from "../../api";

interface IUserForm {
  firstName: string;
  lastName: string;
  username: string;
}

function ProfilePage() {
  const navigate = useNavigate();
  const [, , clearUserLocalStorage] = useUserLocalStorage();
  const [isEditing, setIsEditing] = useState(false);
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);

  const [userData, fetchUserData, isUserDataLoading] = useQueryData<BackendModelsDtosUserDto, undefined>(getApiUserGetCurrentUserOptions, undefined);

  const handleUpdateSuccess = useCallback(() => {
    setIsEditing(false);
    void fetchUserData();
  }, [fetchUserData]);

  const handleDeleteSuccess = useCallback(() => {
    clearUserLocalStorage();
    void navigate(login);
  }, [clearUserLocalStorage, navigate]);

  const [, updateUser, isUpdateLoading] = useMutateData(putApiUserUpdateUserMutation, {
    onSuccess: handleUpdateSuccess,
    successMessage: "Profile updated successfully",
  });

  const [, deleteUser] = useMutateData(deleteApiUserDeleteUserByUserIdMutation, {
    onSuccess: handleDeleteSuccess,
    successMessage: "Account deleted successfully",
  });

  const form = useForm<IUserForm>({
    mode: "controlled",
    initialValues: {
      firstName: userData?.firstName ?? "",
      lastName: userData?.lastName ?? "",
      username: userData?.username ?? "",
    },
    validate: {
      firstName: (value) => (!value.trim() ? "First name is required" : null),
      lastName: (value) => (!value.trim() ? "Last name is required" : null),
      username: (value) => (!value.trim() ? "Username is required" : null),
    },
  });

  useEffect(() => {
    void fetchUserData();
  }, [fetchUserData]);

  const handleSubmit = useCallback(
    async (formData: IUserForm) => {
      if (userData?.userId) {
        await updateUser({
          userId: userData.userId,
          firstName: formData.firstName,
          lastName: formData.lastName,
          username: formData.username,
        });
      }
    },
    [updateUser, userData?.userId],
  );

  const handleDelete = useCallback(async () => {
    if (userData?.userId) {
      await deleteUser(undefined, { userId: userData.userId });
    }
    closeDeleteModal();
  }, [deleteUser, userData?.userId, closeDeleteModal]);

  const toggleEditMode = useCallback(() => {
    setIsEditing((prev) => !prev);
    if (isEditing) {
      form.reset();
    }
  }, [isEditing, form]);

  function renderUserInfo() {
    if (!userData) {
      return null;
    }

    return (
      <Stack gap="md">
        <Group gap="md">
          <IconUser size={24} />
          <Text size="lg" fw={500}>
            {userData.firstName} {userData.lastName}
          </Text>
        </Group>
        <Text c="dimmed">@{userData.username}</Text>
      </Stack>
    );
  }

  function renderEditForm() {
    return (
      <Box pos="relative">
        <LoadingOverlay visible={isUpdateLoading} zIndex={1000} overlayProps={{ radius: "xs", blur: 2 }} />
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput
              label="First Name"
              placeholder="Enter your first name"
              variant="filled"
              radius="xs"
              size="md"
              required
              key={form.key("firstName")}
              {...form.getInputProps("firstName")}
            />
            <TextInput
              label="Last Name"
              placeholder="Enter your last name"
              variant="filled"
              radius="xs"
              size="md"
              required
              key={form.key("lastName")}
              {...form.getInputProps("lastName")}
            />
            <TextInput
              label="Username"
              placeholder="Enter your username"
              variant="filled"
              radius="xs"
              size="md"
              required
              key={form.key("username")}
              {...form.getInputProps("username")}
            />
            <Group justify="flex-end" gap="md">
              <Button variant="light" color="error" radius="xs" onClick={toggleEditMode} disabled={isUpdateLoading}>
                Cancel
              </Button>
              <Button type="submit" variant="light" radius="xs" disabled={isUpdateLoading}>
                Save Changes
              </Button>
            </Group>
          </Stack>
        </form>
      </Box>
    );
  }

  function renderActions() {
    if (isEditing) {
      return null;
    }

    return (
      <Group justify="flex-end" gap="md">
        <Button variant="light" color="warning" radius="xs" leftSection={<IconEdit size={16} />} onClick={toggleEditMode}>
          Edit Profile
        </Button>
        <Button variant="light" radius="xs" color="error" leftSection={<IconTrash size={16} />} onClick={openDeleteModal}>
          Delete Account
        </Button>
      </Group>
    );
  }

  function renderDeleteModal() {
    return (
      <ConfirmationModal
        opened={deleteModalOpened}
        close={closeDeleteModal}
        onConfirm={handleDelete}
        onCancel={closeDeleteModal}
        question="Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed."
      />
    );
  }

  function renderContent() {
    if (isUserDataLoading) {
      return <LoadingContainer loading={isUserDataLoading}>Loading profile...</LoadingContainer>;
    }

    return (
      <Stack gap="xl">
        <Paper shadow="sm" radius="xs" withBorder p="xl">
          <Stack gap="lg">
            <Group justify="space-between" align="flex-start">
              <Title order={2} size="h3">
                Profile Information
              </Title>
              {renderActions()}
            </Group>
            {isEditing ? renderEditForm() : renderUserInfo()}
          </Stack>
        </Paper>
        {renderDeleteModal()}
      </Stack>
    );
  }

  function render() {
    return (
      <Container size="md" py="xl">
        <Stack gap="lg">
          <Title ta="center" fw={900}>
            My Profile
          </Title>
          {renderContent()}
        </Stack>
      </Container>
    );
  }

  return render();
}

export default memo(ProfilePage);
