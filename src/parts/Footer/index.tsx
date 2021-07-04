
import * as React from 'react';
import clsx from 'clsx';
import { GlobeAltIcon } from '@heroicons/react/outline';

import ImpermaxJadeContainedButton from 'components/buttons/ImpermaxJadeContainedButton';
import {
  IMPERMAX_TELEGRAM_LINK,
  IMPERMAX_TWITTER_LINK,
  IMPERMAX_WEBSITE_LINK,
  IMPERMAX_DISCORD_LINK,
  IMPERMAX_YOU_TUBE_LINK,
  IMPERMAX_MEDIUM_LINK,
  IMPERMAX_GIT_HUB_LINK,
  IMPERMAX_REDDIT_LINK
} from 'config/links';
import { ReactComponent as TwitterLogoIcon } from 'assets/images/icons/twitter-logo.svg';
import { ReactComponent as GitHubLogoIcon } from 'assets/images/icons/git-hub-logo.svg';
import { ReactComponent as TelegramLogoIcon } from 'assets/images/icons/telegram-logo.svg';
import { ReactComponent as DiscordLogoIcon } from 'assets/images/icons/discord-logo.svg';
import { ReactComponent as YouTubeLogoIcon } from 'assets/images/icons/you-tube-logo.svg';
import { ReactComponent as MediumLogoIcon } from 'assets/images/icons/medium-logo.svg';
import { ReactComponent as RedditLogoIcon } from 'assets/images/icons/reddit-logo.svg';

const navigation = {
  coinOfferings: [
    { name: 'Hot tokens', href: '#' },
    { name: 'New listings', href: '#' },
    { name: 'Upcoming listings', href: '#' }
  ],
  IMPERMAX: [
    { name: 'How to buy', href: '#' },
    { name: 'Homepage', href: '#' },
    { name: 'Buy now', href: '#' },
    { name: 'Our team', href: '#' }
  ],
  apply: [
    { name: 'Apply now', href: '#' },
    { name: 'FAQ', href: '#' },
    { name: 'Why us', href: '#' },
    { name: 'Requirements', href: '#' }
  ],
  staking: [
    { name: 'How it works', href: '#' },
    { name: 'Connect wallet', href: '#' }
  ],
  social: [
    {
      name: 'Website',
      href: IMPERMAX_WEBSITE_LINK,
      // eslint-disable-next-line react/display-name
      icon: (props: React.ComponentPropsWithRef<'svg'>) => (
        <GlobeAltIcon
          width={24}
          height={24}
          {...props} />
      )
    },
    {
      name: 'Telegram',
      href: IMPERMAX_TELEGRAM_LINK,
      // eslint-disable-next-line react/display-name
      icon: (props: React.ComponentPropsWithRef<'svg'>) => (
        <TelegramLogoIcon
          width={18}
          height={16}
          {...props} />
      )
    },
    {
      name: 'Discord',
      href: IMPERMAX_DISCORD_LINK,
      // eslint-disable-next-line react/display-name
      icon: (props: React.ComponentPropsWithRef<'svg'>) => (
        <DiscordLogoIcon
          width={18}
          height={12}
          {...props} />
      )
    },
    {
      name: 'YouTube',
      href: IMPERMAX_YOU_TUBE_LINK,
      // eslint-disable-next-line react/display-name
      icon: (props: React.ComponentPropsWithRef<'svg'>) => (
        <YouTubeLogoIcon
          width={21}
          height={15}
          {...props} />
      )
    },
    {
      name: 'Medium',
      href: IMPERMAX_MEDIUM_LINK,
      // eslint-disable-next-line react/display-name
      icon: (props: React.ComponentPropsWithRef<'svg'>) => (
        <MediumLogoIcon
          width={16}
          height={14}
          {...props} />
      )
    },
    {
      name: 'Reddit',
      href: IMPERMAX_REDDIT_LINK,
      // eslint-disable-next-line react/display-name
      icon: (props: React.ComponentPropsWithRef<'svg'>) => (
        <RedditLogoIcon
          width={18}
          height={17}
          {...props} />
      )
    },
    {
      name: 'Twitter',
      href: IMPERMAX_TWITTER_LINK,
      // eslint-disable-next-line react/display-name
      icon: (props: React.ComponentPropsWithRef<'svg'>) => (
        <TwitterLogoIcon
          width={24}
          height={24}
          {...props} />
      )
    },
    {
      name: 'GitHub',
      href: IMPERMAX_GIT_HUB_LINK,
      // eslint-disable-next-line react/display-name
      icon: (props: React.ComponentPropsWithRef<'svg'>) => (
        <GitHubLogoIcon
          width={24}
          height={24}
          {...props} />
      )
    }
  ]
};

type Ref = HTMLDivElement;
type Props = React.ComponentPropsWithRef<'footer'>;

const Footer = React.forwardRef<Ref, Props>(({
  className,
  ...rest
}, ref): JSX.Element => (
  <footer
    ref={ref}
    className={clsx(
      'border-t',
      'bg-IMPERMAXAlabaster',
      className
    )}
    aria-labelledby='footerHeading'
    {...rest}>
    <h2
      id='footerHeading'
      className='sr-only'>
      Footer
    </h2>
    <div
      className={clsx(
        'max-w-7xl',
        'mx-auto',
        'py-12',
        'px-4',
        'sm:px-6',
        'lg:py-16',
        'lg:px-8'
      )}>
      <div
        className={clsx(
          'xl:grid',
          'xl:grid-cols-3',
          'xl:gap-8'
        )}>
        <div
          className={clsx(
            'grid',
            'grid-cols-2',
            'gap-8',
            'xl:col-span-2'
          )}>
          <div
            className={clsx(
              'md:grid',
              'md:grid-cols-2',
              'md:gap-8'
            )}>
            <div>
              <h3
                className={clsx(
                  'text-sm',
                  'font-semibold',
                  'text-gray-400',
                  'tracking-wider',
                  'uppercase'
                )}>
                Coin offerings
              </h3>
              <ul
                className={clsx(
                  'mt-4',
                  'space-y-4'
                )}>
                {navigation.coinOfferings.map(item => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className={clsx(
                        'text-base',
                        'text-textSecondary',
                        'hover:text-textPrimary'
                      )}>
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div
              className={clsx(
                'mt-12',
                'md:mt-0'
              )}>
              <h3
                className={clsx(
                  'text-sm',
                  'font-semibold',
                  'text-gray-400',
                  'tracking-wider',
                  'uppercase'
                )}>
                IMPERMAX
              </h3>
              <ul
                className={clsx(
                  'mt-4',
                  'space-y-4'
                )}>
                {navigation.IMPERMAX.map(item => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className={clsx(
                        'text-base',
                        'text-textSecondary',
                        'hover:text-textPrimary'
                      )}>
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div
            className={clsx(
              'md:grid',
              'md:grid-cols-2',
              'md:gap-8'
            )}>
            <div>
              <h3
                className={clsx(
                  'text-sm',
                  'font-semibold',
                  'text-gray-400',
                  'tracking-wider',
                  'uppercase'
                )}>
                Apply
              </h3>
              <ul
                className={clsx(
                  'mt-4',
                  'space-y-4'
                )}>
                {navigation.apply.map(item => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className={clsx(
                        'text-base',
                        'text-textSecondary',
                        'hover:text-textPrimary'
                      )}>
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div
              className={clsx(
                'mt-12',
                'md:mt-0'
              )}>
              <h3
                className={clsx(
                  'text-sm',
                  'font-semibold',
                  'text-gray-400',
                  'tracking-wider',
                  'uppercase'
                )}>
                Staking
              </h3>
              <ul
                className={clsx(
                  'mt-4',
                  'space-y-4'
                )}>
                {navigation.staking.map(item => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className={clsx(
                        'text-base',
                        'text-textSecondary',
                        'hover:text-textPrimary'
                      )}>
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div
          className={clsx(
            'mt-8',
            'xl:mt-0'
          )}>
          <h3
            className={clsx(
              'text-sm',
              'font-semibold',
              'text-gray-400',
              'tracking-wider',
              'uppercase'
            )}>
            Subscribe to our newsletter
          </h3>
          <p
            className={clsx(
              'mt-4',
              'text-base',
              'text-textSecondary'
            )}>
            The latest news, articles, and resources, sent to your inbox weekly.
          </p>
          <form
            className={clsx(
              'mt-4',
              'sm:flex',
              'sm:max-w-md'
            )}>
            {/* TODO: should componentize */}
            <label
              htmlFor='emailAddress'
              className='sr-only'>
              Email address
            </label>
            <input
              type='email'
              name='emailAddress'
              id='emailAddress'
              autoComplete='email'
              required
              className={clsx(
                'appearance-none',
                'min-w-0',
                'w-full',
                'bg-white',
                'border',
                'border-gray-300',
                'rounded-md',
                'shadow-sm',
                'py-2',
                'px-4',
                'text-base',
                'text-textPrimary',
                'placeholder-gray-500',
                'focus:outline-none',
                'focus:ring-indigo-500',
                'focus:border-indigo-500',
                'focus:placeholder-gray-400'
              )}
              placeholder='Enter your email' />
            <div
              className={clsx(
                'mt-3',
                'rounded-md',
                'sm:mt-0',
                'sm:ml-3',
                'sm:flex-shrink-0'
              )}>
              <ImpermaxJadeContainedButton
                style={{
                  height: '100%'
                }}
                type='submit'>
                Subscribe
              </ImpermaxJadeContainedButton>
            </div>
          </form>
        </div>
      </div>
      <div
        className={clsx(
          'mt-8',
          'border-t',
          'border-gray-200',
          'pt-8',
          'md:flex',
          'md:items-center',
          'md:justify-between'
        )}>
        <div
          className={clsx(
            'flex',
            'space-x-6',
            'md:order-2',
            'items-center'
          )}>
          {navigation.social.map(item => (
            <a
              key={item.name}
              href={item.href}
              className={clsx(
                'text-gray-400',
                'hover:text-textSecondary'
              )}
              target='_blank'
              rel='noopener noreferrer'>
              <span className='sr-only'>{item.name}</span>
              <item.icon aria-hidden='true' />
            </a>
          ))}
        </div>
        <p
          className={clsx(
            'mt-8',
            'text-base',
            'text-gray-400',
            'md:mt-0',
            'md:order-1'
          )}>
          &copy; 2020 IMPERMAX, Inc. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
));
Footer.displayName = 'Footer';

export default Footer;
