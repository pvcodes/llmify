import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PreferencesTab() {
    return (
        <Card className="border-0 shadow-sm">
            <CardHeader>
                <CardTitle className="text-xl font-semibold tracking-tight">Preferences</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">Customize your settings (coming soon)</p>
            </CardContent>
        </Card>
    );
}