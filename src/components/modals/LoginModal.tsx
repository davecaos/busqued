// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input, Stack, Text } from '@chakra-ui/react';
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from '@/components/ui/dialog';
import { PasswordInput } from '@/components/ui/password-input';
import { getLoginErrorMessage, loginWithCredentials } from '@/logic/login';

export const LoginModal = ({
  isLoginOpen,
  setIsLoginOpen,
  agent,
  loginError,
  setLoginError,
  onLoginSuccess,
}) => {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = user.trim().length > 0 && password.length > 0;

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!canSubmit || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setLoginError('');

    try {
      const session = await loginWithCredentials(agent, user.trim(), password);
      onLoginSuccess(session?.handle || session?.did || user.trim());
      setPassword('');
    } catch (error) {
      setLoginError(getLoginErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DialogRoot
      open={isLoginOpen}
      onOpenChange={(details) => setIsLoginOpen(details.open)}
    >
      <DialogContent className="login-dialog">
        <form onSubmit={handleLogin}>
          <DialogHeader>
            <DialogTitle>Log in to Bluesky</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Stack gap="3">
              <label className="form-label" htmlFor="bsky-handle">
                Bluesky handle
              </label>
              <Input
                autoComplete="username"
                id="bsky-handle"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                placeholder="tuvieja.bsky.social"
              />
              <label className="form-label" htmlFor="bsky-password">
                App password
              </label>
              <PasswordInput
                autoComplete="current-password"
                id="bsky-password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {loginError ? (
                <Text className="login-error" role="alert">
                  {loginError}
                </Text>
              ) : null}
            </Stack>
          </DialogBody>
          <DialogFooter className="dialog-footer">
            <Button
              colorPalette="blue"
              disabled={!canSubmit}
              loading={isSubmitting}
              loadingText="Logging in"
              type="submit"
            >
              Login
            </Button>
            <Button
              onClick={() => setIsLoginOpen(false)}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
          </DialogFooter>
        </form>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
};
