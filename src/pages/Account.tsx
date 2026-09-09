/* Account — email or username + password. Legacy PIN reset stays folded.
 * Logged-in: bind email, username, password, export, delete. */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import MotionRoot from '@/components/MotionRoot';
import {
  Check,
  KeyRound,
  Loader2,
  LogIn,
  LogOut,
  Mail,
  ShieldCheck,
  Trash2,
  UserRound,
} from 'lucide-react';
import { LocaleLink, useLocalePath } from '@/lib/locale-link';
import {
  EMAIL_RE,
  USERNAME_RE,
  bindAccountEmail,
  clearRecoveryFlag,
  deleteAccount,
  exportAccountData,
  isLegacyUser,
  loginAccount,
  logoutAccount,
  parseLoginIdentifier,
  registerAccount,
  resetPasswordWithEmail,
  resetPasswordWithPin,
  updateAccountPassword,
  updateAccountUsername,
  useAuth,
} from '@/lib/auth';

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

type Tab = 'login' | 'register' | 'reset';

const inputCls =
  'w-full rounded-md border border-hairline bg-surface2 px-3.5 py-2.5 font-sans text-sm text-tx-primary placeholder:text-tx-muted/60 outline-none transition-colors focus:border-gold/60';

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="pixel-label mb-1.5 block text-[8px] text-tx-muted">{label}</span>
      {children}
      {hint && <span className="mt-1 block font-sans text-micro11 text-tx-muted">{hint}</span>}
    </label>
  );
}

export default function Account() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const localePath = useLocalePath();
  const { ready, user, profile, recovery } = useAuth();
  const [tab, setTab] = useState<Tab>('login');

  const [identifier, setIdentifier] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);

  const [setEmailValue, setSetEmailValue] = useState('');
  const [setUsernameValue, setSetUsernameValue] = useState('');
  const [setPasswordValue, setSetPasswordValue] = useState('');
  const [deleteName, setDeleteName] = useState('');

  const errText = (code: string | null) =>
    code ? t(`account.errors.${code}`, { defaultValue: t('account.errors.unknown') }) : null;

  const accountRedirect = () => {
    if (typeof window === 'undefined') return undefined;
    return `${window.location.origin}${localePath('/account')}`;
  };

  const submit = async () => {
    setMsg(null);
    setBusy(true);
    try {
      if (tab === 'login') {
        const { error } = await loginAccount(identifier.trim(), password);
        if (error) setMsg({ kind: 'err', text: errText(error)! });
        else navigate(localePath('/'));
      } else if (tab === 'register') {
        if (password !== password2) return setMsg({ kind: 'err', text: t('account.errors.password_mismatch') });
        const { error, pendingConfirm } = await registerAccount(
          username.trim(),
          email.trim(),
          password,
          accountRedirect(),
        );
        if (error) setMsg({ kind: 'err', text: errText(error)! });
        else if (pendingConfirm) {
          setMsg({ kind: 'ok', text: t('account.register.confirmInbox') });
          setTab('login');
          setIdentifier(email.trim());
          setPassword('');
        }
      } else if (showPin) {
        const { error } = await resetPasswordWithPin(username.trim(), pin, password);
        if (error) setMsg({ kind: 'err', text: errText(error)! });
        else {
          setMsg({ kind: 'ok', text: t('account.reset.done') });
          setTab('login');
          setPassword('');
          setPin('');
        }
      } else {
        const { error } = await resetPasswordWithEmail(email.trim(), accountRedirect());
        if (error) setMsg({ kind: 'err', text: errText(error)! });
        else setMsg({ kind: 'ok', text: t('account.reset.emailSent') });
      }
    } catch {
      setMsg({ kind: 'err', text: errText('unknown')! });
    } finally {
      setBusy(false);
    }
  };

  const saveRecovery = async () => {
    setMsg(null);
    setBusy(true);
    try {
      if (password !== password2) {
        setMsg({ kind: 'err', text: t('account.errors.password_mismatch') });
        return;
      }
      const { error } = await updateAccountPassword(password);
      if (error) setMsg({ kind: 'err', text: errText(error)! });
      else {
        clearRecoveryFlag();
        setMsg({ kind: 'ok', text: t('account.reset.done') });
        setPassword('');
        setPassword2('');
      }
    } finally {
      setBusy(false);
    }
  };

  if (!ready) return null;

  if (recovery && user) {
    return (
      <MotionRoot>
        <div className="mx-auto max-w-content px-4 pb-20 pt-6 md:px-8">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EASE }} className="mx-auto max-w-md">
            <p className="pixel-label text-[9px] text-gold">{t('account.eyebrow')}</p>
            <h1 className="mt-1 font-display text-2xl font-extrabold tracking-wide text-tx-primary">
              {t('account.recovery.title')}
            </h1>
            <p className="mt-2 font-sans text-[0.8438rem] leading-relaxed text-tx-secondary">{t('account.recovery.lede')}</p>
            <div className="mt-4 flex flex-col gap-4 rounded-lg border border-hairline bg-surface1 p-5">
              <Field label={t('account.newPassword')} hint={t('account.passwordHint')}>
                <input className={inputCls} type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" maxLength={128} />
              </Field>
              <Field label={t('account.passwordConfirm')}>
                <input className={inputCls} type="password" value={password2} onChange={(e) => setPassword2(e.target.value)} autoComplete="new-password" maxLength={128} />
              </Field>
              {msg && (
                <p className={`flex items-center gap-1.5 font-sans text-[0.7813rem] ${msg.kind === 'ok' ? 'text-gold' : 'text-type-fire'}`}>
                  {msg.kind === 'ok' && <Check size={13} />}
                  {msg.text}
                </p>
              )}
              <button
                type="button"
                disabled={busy || password.length < 8}
                onClick={() => void saveRecovery()}
                className="tb-btn tb-btn-primary mt-1 justify-center disabled:opacity-40"
              >
                {busy ? <Loader2 size={13} className="animate-spin" /> : <KeyRound size={13} />}
                {t('account.submit.recovery')}
              </button>
            </div>
          </motion.div>
        </div>
      </MotionRoot>
    );
  }

  if (user && profile) {
    const legacy = isLegacyUser(user);
    const shownEmail = !legacy ? (user.email ?? profile.email ?? '') : '';
    return (
      <MotionRoot>
        <div className="mx-auto max-w-content px-4 pb-20 pt-6 md:px-8">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EASE }} className="mx-auto max-w-md">
            <p className="pixel-label text-[9px] text-gold">{t('account.eyebrow')}</p>
            <h1 className="mt-1 font-display text-2xl font-extrabold tracking-wide text-tx-primary">
              {t('account.hi', { name: profile.username })}
            </h1>
            <div className="mt-6 rounded-lg border border-hairline bg-surface1 p-5">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full border border-gold/40 bg-gold-soft text-gold">
                  <UserRound size={20} />
                </span>
                <div className="min-w-0">
                  <div className="font-display text-base font-bold text-tx-primary">{profile.username}</div>
                  <div className="flex items-center gap-1.5 font-sans text-micro12 text-tx-muted">
                    <ShieldCheck size={12} className="text-gold" />
                    {t('account.synced')}
                  </div>
                  {shownEmail && (
                    <div className="mt-0.5 truncate font-sans text-micro11 text-tx-muted">{shownEmail}</div>
                  )}
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-4 border-t border-hairline pt-5">
                {legacy ? (
                  <>
                    <p className="font-sans text-micro12 leading-relaxed text-tx-muted">{t('account.settings.emailPending')}</p>
                    <Field label={t('account.email')}>
                      <input className={inputCls} type="email" value={setEmailValue} onChange={(e) => setSetEmailValue(e.target.value)} autoComplete="email" />
                    </Field>
                    <button
                      type="button"
                      disabled={busy || !EMAIL_RE.test(setEmailValue.trim())}
                      onClick={() => void (async () => {
                        setMsg(null);
                        setBusy(true);
                        const { error } = await bindAccountEmail(setEmailValue.trim(), accountRedirect());
                        setBusy(false);
                        setMsg(error ? { kind: 'err', text: errText(error)! } : { kind: 'ok', text: t('account.settings.emailSaved') });
                      })()}
                      className="tb-btn justify-center disabled:opacity-40"
                    >
                      <Mail size={13} />
                      {t('account.settings.emailSave')}
                    </button>
                  </>
                ) : (
                  <p className="flex items-center gap-1.5 font-sans text-micro12 text-tx-muted">
                    <Check size={12} className="text-gold" />
                    {t('account.settings.emailBound')}
                  </p>
                )}

                <Field label={t('account.username')}>
                  <input
                    className={inputCls}
                    value={setUsernameValue || profile.username}
                    onChange={(e) => setSetUsernameValue(e.target.value)}
                    autoComplete="username"
                    maxLength={20}
                  />
                </Field>
                <button
                  type="button"
                  disabled={busy || !USERNAME_RE.test((setUsernameValue || profile.username).trim())}
                  onClick={() => void (async () => {
                    setMsg(null);
                    setBusy(true);
                    const { error } = await updateAccountUsername((setUsernameValue || profile.username).trim());
                    setBusy(false);
                    setMsg(error ? { kind: 'err', text: errText(error)! } : { kind: 'ok', text: t('account.settings.usernameSaved') });
                  })()}
                  className="tb-btn justify-center disabled:opacity-40"
                >
                  {t('account.settings.usernameSave')}
                </button>

                <Field label={t('account.newPassword')} hint={t('account.passwordHint')}>
                  <input className={inputCls} type="password" value={setPasswordValue} onChange={(e) => setSetPasswordValue(e.target.value)} autoComplete="new-password" maxLength={128} />
                </Field>
                <button
                  type="button"
                  disabled={busy || setPasswordValue.length < 8}
                  onClick={() => void (async () => {
                    setMsg(null);
                    setBusy(true);
                    const { error } = await updateAccountPassword(setPasswordValue);
                    setBusy(false);
                    if (!error) setSetPasswordValue('');
                    setMsg(error ? { kind: 'err', text: errText(error)! } : { kind: 'ok', text: t('account.settings.passwordSaved') });
                  })()}
                  className="tb-btn justify-center disabled:opacity-40"
                >
                  {t('account.settings.passwordSave')}
                </button>
              </div>

              {msg && (
                <p className={`mt-4 flex items-center gap-1.5 font-sans text-[0.7813rem] ${msg.kind === 'ok' ? 'text-gold' : 'text-type-fire'}`}>
                  {msg.kind === 'ok' && <Check size={13} />}
                  {msg.text}
                </p>
              )}

              <div className="mt-5 grid gap-2">
                <button type="button" onClick={() => void logoutAccount()} className="tb-btn w-full justify-center">
                  <LogOut size={13} />
                  {t('account.logout')}
                </button>
                <button type="button" onClick={() => void logoutAccount(true)} className="tb-btn w-full justify-center">
                  <LogOut size={13} />
                  {t('account.settings.logoutAll')}
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void (async () => {
                    setBusy(true);
                    const { data, error } = await exportAccountData();
                    setBusy(false);
                    if (error || !data) {
                      setMsg({ kind: 'err', text: errText(error)! });
                      return;
                    }
                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `mypokepanion-${profile.username}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                  })()}
                  className="tb-btn w-full justify-center"
                >
                  {t('account.settings.export')}
                </button>
              </div>

              <div className="mt-5 border-t border-hairline pt-5">
                <p className="pixel-label mb-2 text-[8px] text-tx-muted">{t('account.settings.delete')}</p>
                <p className="mb-2 font-sans text-micro12 text-tx-muted">{t('account.settings.deleteHint')}</p>
                <input
                  className={inputCls}
                  value={deleteName}
                  onChange={(e) => setDeleteName(e.target.value)}
                  autoComplete="off"
                  placeholder={profile.username}
                />
                <button
                  type="button"
                  disabled={busy || deleteName.trim().toLowerCase() !== profile.username.toLowerCase()}
                  onClick={() => void (async () => {
                    if (deleteName.trim().toLowerCase() !== profile.username.toLowerCase()) {
                      setMsg({ kind: 'err', text: t('account.errors.delete_confirm') });
                      return;
                    }
                    setBusy(true);
                    const { error } = await deleteAccount();
                    setBusy(false);
                    if (error) setMsg({ kind: 'err', text: errText(error)! });
                  })()}
                  className="tb-btn mt-2 w-full justify-center disabled:opacity-40"
                >
                  <Trash2 size={13} />
                  {t('account.settings.deleteConfirm')}
                </button>
              </div>
            </div>
            <p className="mt-4 font-sans text-micro12 leading-relaxed text-tx-muted">{t('account.dataNote')}</p>
          </motion.div>
        </div>
      </MotionRoot>
    );
  }

  const loginReady = parseLoginIdentifier(identifier).ok && password.length >= 8;
  const registerReady =
    USERNAME_RE.test(username.trim()) && EMAIL_RE.test(email.trim()) && password.length >= 8;
  const resetReady = showPin
    ? USERNAME_RE.test(username.trim()) && pin.length === 6 && password.length >= 8
    : EMAIL_RE.test(email.trim());

  return (
    <MotionRoot>
      <div className="mx-auto max-w-content px-4 pb-20 pt-6 md:px-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EASE }} className="mx-auto max-w-md">
          <p className="pixel-label text-[9px] text-gold">{t('account.eyebrow')}</p>
          <h1 className="mt-1 font-display text-2xl font-extrabold tracking-wide text-tx-primary">
            {t('account.title')}
          </h1>
          <p className="mt-2 font-sans text-[0.8438rem] leading-relaxed text-tx-secondary">{t('account.lede')}</p>

          <div className="mt-6 grid grid-cols-3 gap-1 rounded-md border border-hairline bg-surface1 p-1">
            {(['login', 'register', 'reset'] as Tab[]).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => { setTab(k); setMsg(null); }}
                className={`pixel-label rounded-sm py-2 text-[8px] transition-colors ${
                  tab === k ? 'bg-gold-soft text-gold' : 'text-tx-muted hover:text-tx-primary'
                }`}
              >
                {t(`account.tabs.${k}`)}
              </button>
            ))}
          </div>

          <div className="mt-4 flex flex-col gap-4 rounded-lg border border-hairline bg-surface1 p-5">
            {tab === 'login' && (
              <Field label={t('account.identifier')}>
                <input
                  className={inputCls}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  autoComplete="username"
                  placeholder="ash@example.com"
                />
              </Field>
            )}

            {tab === 'register' && (
              <>
                <Field label={t('account.email')} hint={t('account.emailHint')}>
                  <input className={inputCls} type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
                </Field>
                <Field label={t('account.username')} hint={t('account.usernameHint')}>
                  <input className={inputCls} value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" placeholder="ash_ketchum" maxLength={20} />
                </Field>
              </>
            )}

            {tab === 'reset' && !showPin && (
              <Field label={t('account.email')}>
                <input className={inputCls} type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
              </Field>
            )}

            {tab === 'reset' && showPin && (
              <Field label={t('account.username')} hint={t('account.pinResetHint')}>
                <input className={inputCls} value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" maxLength={20} />
              </Field>
            )}

            {(tab !== 'reset' || showPin) && (
              <Field label={tab === 'reset' ? t('account.newPassword') : t('account.password')} hint={tab !== 'login' ? t('account.passwordHint') : undefined}>
                <input
                  className={inputCls}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
                  maxLength={128}
                />
              </Field>
            )}

            {tab === 'register' && (
              <Field label={t('account.passwordConfirm')}>
                <input className={inputCls} type="password" value={password2} onChange={(e) => setPassword2(e.target.value)} autoComplete="new-password" maxLength={128} />
              </Field>
            )}

            {tab === 'reset' && showPin && (
              <Field label={t('account.pin')} hint={t('account.pinHint')}>
                <input
                  className={inputCls}
                  inputMode="numeric"
                  maxLength={6}
                  autoComplete="one-time-code"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="••••••"
                />
              </Field>
            )}

            {tab === 'reset' && (
              <button
                type="button"
                onClick={() => { setShowPin((v) => !v); setMsg(null); }}
                className="self-start font-sans text-micro12 text-gold underline-offset-2 hover:underline"
              >
                {t('account.legacyPinToggle')}
              </button>
            )}

            {msg && (
              <p className={`flex items-center gap-1.5 font-sans text-[0.7813rem] ${msg.kind === 'ok' ? 'text-gold' : 'text-type-fire'}`}>
                {msg.kind === 'ok' && <Check size={13} />}
                {msg.text}
              </p>
            )}

            <button
              type="button"
              disabled={busy || (tab === 'login' ? !loginReady : tab === 'register' ? !registerReady : !resetReady)}
              onClick={() => void submit()}
              className="tb-btn tb-btn-primary mt-1 justify-center disabled:opacity-40"
            >
              {busy ? <Loader2 size={13} className="animate-spin" /> : tab === 'reset' ? <KeyRound size={13} /> : <LogIn size={13} />}
              {t(tab === 'reset' && showPin ? 'account.submit.resetPin' : `account.submit.${tab}`)}
            </button>
          </div>

          <p className="mt-4 font-sans text-micro12 leading-relaxed text-tx-muted">
            {t('account.guestNote')}{' '}
            <LocaleLink to="/datenschutz" className="text-gold underline-offset-2 hover:underline">
              {t('account.privacyLink')}
            </LocaleLink>
          </p>
        </motion.div>
      </div>
    </MotionRoot>
  );
}
