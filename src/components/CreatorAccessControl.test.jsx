import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import CreatorAccessControl, {
  CREATOR_OS_LOGIN_PATH,
  CREATOR_OS_LOGOUT_PATH,
} from './CreatorAccessControl';

describe('CreatorAccessControl', () => {
  it('shows the protected session state and Azure logout route', () => {
    const html = renderToStaticMarkup(<CreatorAccessControl />);

    expect(html).toContain('Microsoft 계정으로 보호됨');
    expect(html).toContain('Creator OS에서 로그아웃');
    expect(html).toContain(`href="${CREATOR_OS_LOGOUT_PATH.replaceAll('&', '&amp;')}"`);
    expect(CREATOR_OS_LOGIN_PATH).toBe('/.auth/login/aad?post_login_redirect_uri=/');
  });
});
