#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

// Structure to represent each call
struct Call {
    int start;
    int end;
    int volume;

    Call(int s, int d, int v) {
        start = s;
        end = s + d;
        volume = v;
    }
};

// Function to find the last non-overlapping call using binary search
int findLastNonOverlapping(const vector<Call>& calls, int i) {
    int start = calls[i].start;
    int left = 0, right = i - 1, last = -1;

    while (left <= right) {
        int mid = (left + right) / 2;
        if (calls[mid].end <= start) {
            last = mid;
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return last;
}

// Function to calculate the maximum volume
int phoneCalls(vector<int>& start, vector<int>& duration, vector<int>& volume) {
    int n = start.size();
    vector<Call> calls;

    // Create list of calls
    for (int i = 0; i < n; i++) {
        calls.push_back(Call(start[i], duration[i], volume[i]));
    }

    // Sort calls by end time
    sort(calls.begin(), calls.end(), [](Call& a, Call& b) {
        return a.end < b.end;
    });

    // DP array to store max volume
    vector<int> dp(n);
    dp[0] = calls[0].volume;

    for (int i = 1; i < n; i++) {
        // Option 1: skip the current call
        dp[i] = dp[i - 1];

        // Option 2: take the current call
        int last = findLastNonOverlapping(calls, i);
        dp[i] = max(dp[i], calls[i].volume + (last == -1 ? 0 : dp[last]));
    }

    return dp[n - 1];
}

int main() {
    int t;
    cin >> t;

    while (t--) {
        int n;
        cin >> n;

        vector<int> start(n), duration(n), volume(n);

        for (int i = 0; i < n; i++) cin >> start[i];
        for (int i = 0; i < n; i++) cin >> duration[i];
        for (int i = 0; i < n; i++) cin >> volume[i];

        cout << phoneCalls(start, duration, volume) << endl;
    }

    return 0;
}