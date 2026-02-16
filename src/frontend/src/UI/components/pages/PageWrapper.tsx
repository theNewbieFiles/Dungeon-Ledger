import { UserBarWrapper } from "../UserBarWrapper/UserBarWrapper";


export function PageWrapper({ children }: { children: React.ReactNode }) {
    return (
        <div className="dashboard-page-container page-wrapper">
            <UserBarWrapper />

            {children}
        </div>
    )
}