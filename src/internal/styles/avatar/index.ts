export const style = /*css*/ `
    .rs-avatar {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: dt('avatar.width');
        height: dt('avatar.height');
        font-size: dt('avatar.font.size');
        background: dt('avatar.background');
        color: dt('avatar.color');
        border-radius: dt('avatar.border.radius');
    }

    .rs-avatar-image {
        background: transparent;
    }

    .rs-avatar-circle {
        border-radius: 50%;
    }

    .rs-avatar-circle img {
        border-radius: 50%;
    }

    .rs-avatar-icon {
        font-size: dt('avatar.icon.size');
        width: dt('avatar.icon.size');
        height: dt('avatar.icon.size');
    }

    .rs-avatar img {
        width: 100%;
        height: 100%;
    }

    .rs-avatar-lg {
        width: dt('avatar.lg.width');
        height: dt('avatar.lg.width');
        font-size: dt('avatar.lg.font.size');
    }

    .rs-avatar-lg .rs-avatar-icon {
        font-size: dt('avatar.lg.icon.size');
        width: dt('avatar.lg.icon.size');
        height: dt('avatar.lg.icon.size');
    }

    .rs-avatar-xl {
        width: dt('avatar.xl.width');
        height: dt('avatar.xl.width');
        font-size: dt('avatar.xl.font.size');
    }

    .rs-avatar-xl .rs-avatar-icon {
        font-size: dt('avatar.xl.icon.size');
        width: dt('avatar.xl.icon.size');
        height: dt('avatar.xl.icon.size');
    }

    .rs-avatar-group {
        display: flex;
        align-items: center;
    }

    .rs-avatar-group .rs-avatar + .rs-avatar {
        margin-inline-start: dt('avatar.group.offset');
    }

    .rs-avatar-group .rs-avatar {
        border: 2px solid dt('avatar.group.border.color');
    }

    .rs-avatar-group .rs-avatar-lg + .rs-avatar-lg {
        margin-inline-start: dt('avatar.lg.group.offset');
    }

    .rs-avatar-group .rs-avatar-xl + .rs-avatar-xl {
        margin-inline-start: dt('avatar.xl.group.offset');
    }
`;
