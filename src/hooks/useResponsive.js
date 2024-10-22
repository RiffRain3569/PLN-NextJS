import { useMediaQuery } from 'react-responsive';

export const useResponsive = () => {
    const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
    const isTablet = useMediaQuery({ query: '(min-width: 768px) and (max-width: 1024px)' });
    const isDesktop = useMediaQuery({ query: '(min-width: 1025px)' });

    return { isMobile, isTablet, isDesktop };
};
