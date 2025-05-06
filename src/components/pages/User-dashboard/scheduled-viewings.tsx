import { ScheduledViewing } from "@/components/shared";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const DashboardSchedule = () => {
    return (
      <div>
        <h1 className="text-2xl font-semibold mb-6">Scheduled Viewings</h1>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Viewings</CardTitle>
              <CardDescription>Your scheduled property viewings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <ScheduledViewing
                  property="123 Main Street"
                  date="2025-05-01"
                  time="14:00"
                  agent="John Smith"
                />
                <ScheduledViewing
                  property="456 Oak Avenue"
                  date="2025-05-03"
                  time="10:30"
                  agent="Sarah Johnson"
                />
              </div>
            </CardContent>
          </Card>
  
          <Card>
            <CardHeader>
              <CardTitle>Past Viewings</CardTitle>
              <CardDescription>Properties you&apos;ve already visited</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <ScheduledViewing
                  property="789 Pine Road"
                  date="2025-04-25"
                  time="15:00"
                  agent="Michael Brown"
                  isPast
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };
  