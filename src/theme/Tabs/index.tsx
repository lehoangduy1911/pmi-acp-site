import React from 'react';
import TabsOriginal from '@theme-original/Tabs';

type Props = React.ComponentProps<typeof TabsOriginal>;

export default function TabsWrapper(props: Props) {
    const { groupId, className, ...rest } = props;

    // Nếu là tabs chuyển ngôn ngữ, thêm class để CSS sticky nhận diện
    const extra =
        groupId === 'lang'
            ? ['lang-tabs', className].filter(Boolean).join(' ')
            : className || undefined;

    return <TabsOriginal {...rest} groupId={groupId} className={extra} />;
}
