import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function NotificationsTab() {
    return (
        <Card className="border-0 shadow-sm">
            <CardHeader>
                <CardTitle className="text-xl font-semibold tracking-tight">Notifications</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">Manage notifications (coming soon)</p>
            </CardContent>
        </Card>
    );
}