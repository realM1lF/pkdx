/* Account — login / register / password-reset (username + password + 6-digit
 * recovery PIN, no email). Holo-Dex style, three tabs. */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { Check, KeyRound, Loader2, LogIn, LogOut, ShieldCheck, UserRound } from 'lucide-react';
import { LocaleLink, useLocalePath } from '@/lib/locale-link';
import {
  USERNAME_RE,
  loginAccount,
  logoutAccount,
  registerAccount,
  resetPasswordWithPin,
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
      {hint && <span className="mt-1 block font-sans text-[11px] text-tx-muted">{hint}</span>}
    </label>
  );
}

export default function Account() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const localePath = useLocalePath();
  const { ready, user, profile } = useAuth();
  const [tab, setTab] = useState<Tab>('login');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [pin, setPin] = useState('');
  const [pin2, setPin2] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);

  const errText = (code: string | null) =>
    code ? t(`account.errors.${code}`, { defaultValue: t('account.errors.unknown') }) : null;

  const submit = async () => {
    setMsg(null);
    setBusy(true);
    try {
      if (tab === 'login') {
        const { error } = await loginAccount(username.trim(), password);
        if (error) setMsg({ kind: 'err', text: errText(error)! });
        else navigate(localePath('/'));
      } else if (tab === 'register') {
        if (password !== password2) return setMsg({ kind: 'err', text: t('account.errors.password_mismatch') });
        if (pin !== pin2) return setMsg({ kind: 'err', text: t('account.errors.pin_mismatch') });
        const { error } = await registerAccount(username.trim(), password, pin);
        if (error) setMsg({ kind: 'err', text: errText(error)! });
        else navigate(localePath('/'));
      } else {
        const { error } = await resetPasswordWithPin(username.trim(), pin, password);
        if (error) setMsg({ kind: 'err', text: errText(error)! });
        else {
          setMsg({ kind: 'ok', text: t('account.reset.done') });
          setTab('login');
          setPassword('');
        }
      }
    } finally {
      setBusy(false);
    }
  };

  if (!ready) return null;

  /* logged-in view */
  if (user && profile) {
    return (
      <div className="mx-auto max-w-content px-4 pb-20 pt-6 md:px-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EASE }} className="mx-auto max-w-md">
          <p className="pixel-label text-[9px] text-gold">{t('account.eyebrow')}</p>
          <h1 className="mt-1 font-display text-2xl font-extrabold uppercase tracking-wide text-tx-primary">
            {t('account.hi', { name: profile.username })}
          </h1>
          <div className="mt-6 rounded-lg border border-hairline bg-surface1 p-5">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full border border-gold/40 bg-gold-soft text-gold">
                <UserRound size={20} />
              </span>
              <div>
                <div className="font-display text-base font-bold text-tx-primary">{profile.username}</div>
                <div className="flex items-center gap-1.5 font-sans text-[12px] text-tx-muted">
                  <ShieldCheck size={12} className="text-gold" />
                  {t('account.synced')}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => void logoutAccount()}
              className="tb-btn mt-5 w-full justify-center"
            >
              <LogOut size={13} />
              {t('account.logout')}
            </button>
          </div>
          <p className="mt-4 font-sans text-[12px] leading-relaxed text-tx-muted">{t('account.dataNote')}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-content px-4 pb-20 pt-6 md:px-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EASE }} className="mx-auto max-w-md">
        <p className="pixel-label text-[9px] text-gold">{t('account.eyebrow')}</p>
        <h1 className="mt-1 font-display text-2xl font-extrabold uppercase tracking-wide text-tx-primary">
          {t('account.title')}
        </h1>
        <p className="mt-2 font-sans text-[13.5px] leading-relaxed text-tx-secondary">{t('account.lede')}</p>

        {/* tabs */}
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
          <Field label={t('account.username')} hint={tab === 'register' ? t('account.usernameHint') : undefined}>
            <input
              className={inputCls}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              placeholder="ash_ketchum"
              maxLength={20}
            />
          </Field>

          <Field label={tab === 'reset' ? t('account.newPassword') : t('account.password')} hint={tab !== 'login' ? t('account.passwordHint') : undefined}>
            <input
              className={inputCls}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
            />
          </Field>

          {tab === 'register' && (
            <>
              <Field label={t('account.passwordConfirm')}>
                <input className={inputCls} type="password" value={password2} onChange={(e) => setPassword2(e.target.value)} autoComplete="new-password" />
              </Field>
              <Field label={t('account.pin')} hint={t('account.pinHint')}>
                <input
                  className={inputCls}
                  inputMode="numeric"
                  pattern="\d{6}"
                  maxLength={6}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="••••••"
                />
              </Field>
              <Field label={t('account.pinConfirm')}>
                <input
                  className={inputCls}
                  inputMode="numeric"
                  maxLength={6}
                  value={pin2}
                  onChange={(e) => setPin2(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="••••••"
                />
              </Field>
            </>
          )}

          {tab === 'reset' && (
            <Field label={t('account.pin')} hint={t('account.pinResetHint')}>
              <input
                className={inputCls}
                inputMode="numeric"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="••••••"
              />
            </Field>
          )}

          {msg && (
            <p className={`flex items-center gap-1.5 font-sans text-[12.5px] ${msg.kind === 'ok' ? 'text-gold' : 'text-type-fire'}`}>
              {msg.kind === 'ok' && <Check size={13} />}
              {msg.text}
            </p>
          )}

          <button
            type="button"
            disabled={busy || !USERNAME_RE.test(username.trim()) || password.length < 8 || (tab === 'register' && pin.length !== 6) || (tab === 'reset' && pin.length !== 6)}
            onClick={() => void submit()}
            className="tb-btn tb-btn-primary mt-1 justify-center disabled:opacity-40"
          >
            {busy ? <Loader2 size={13} className="animate-spin" /> : tab === 'reset' ? <KeyRound size={13} /> : <LogIn size={13} />}
            {t(`account.submit.${tab}`)}
          </button>
        </div>

        <p className="mt-4 font-sans text-[12px] leading-relaxed text-tx-muted">
          {t('account.guestNote')}{' '}
          <LocaleLink to="/datenschutz" className="text-gold underline-offset-2 hover:underline">
            {t('account.privacyLink')}
          </LocaleLink>
        </p>
      </motion.div>
    </div>
  );
}
